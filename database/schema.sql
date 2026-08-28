-- ============================================================
-- Part A: AffiGuard Database Schema (Full Professional Setup)
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. USERS TABLE
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    password_hash TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    plan_expiry TIMESTAMPTZ,
    join_date TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
    total_referrals INT DEFAULT 0,
    free_months_earned INT DEFAULT 0,
    free_months_remaining INT DEFAULT 0,
    telegram_chat_id TEXT,
    whatsapp_number TEXT,
    reset_token TEXT,
    reset_token_expiry TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 2. LINKS TABLE
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS links (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    url TEXT NOT NULL,
    platform TEXT DEFAULT 'generic',
    frequency TEXT DEFAULT 'twice_daily',
    status TEXT DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_checked TIMESTAMPTZ,
    response_time INT,
    layer_used TEXT,
    error_message TEXT,
    last_status_change TIMESTAMPTZ,
    alert_sent BOOLEAN DEFAULT FALSE
);

-- ──────────────────────────────────────────────────────────────
-- 3. CHECK HISTORY
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS check_history (
    id UUID PRIMARY KEY,
    link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT,
    response_time INT,
    layer_used TEXT,
    error_message TEXT,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 4. ALERTS TABLE
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    link_id UUID REFERENCES links(id) ON DELETE SET NULL,
    alert_type TEXT,
    channel TEXT,
    message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    success BOOLEAN DEFAULT FALSE
);

-- ──────────────────────────────────────────────────────────────
-- 5. FEEDBACK TABLE
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT,
    message TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 6. PAYMENTS TABLE
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    plan TEXT,
    status TEXT DEFAULT 'pending',
    gateway TEXT,
    gateway_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 7. COUPONS TABLE
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'free_months',
    value INT DEFAULT 1,
    plan_grant TEXT,
    max_uses INT DEFAULT 1,
    uses INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- ──────────────────────────────────────────────────────────────
-- 8. RATE LIMITS TABLE (for free checker)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
    ip TEXT PRIMARY KEY,
    count INT DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 9. RPC FUNCTION: Increment Rate Limit
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_rate_limit(p_ip TEXT, limit_hour INT)
RETURNS BOOLEAN AS $$
DECLARE
    v_cutoff TIMESTAMPTZ := NOW() - INTERVAL '1 hour';
    v_count INT;
BEGIN
    INSERT INTO rate_limits (ip, count, window_start)
    VALUES (p_ip, 1, NOW())
    ON CONFLICT (ip) DO UPDATE
    SET count = rate_limits.count + 1,
        window_start = EXCLUDED.window_start
    WHERE rate_limits.window_start < v_cutoff;
    
    SELECT count INTO v_count FROM rate_limits
    WHERE ip = p_ip AND window_start >= v_cutoff
    ORDER BY window_start DESC LIMIT 1;
    
    RETURN COALESCE(v_count > limit_hour, FALSE);
END;
$$ LANGUAGE plpgsql;

-- ──────────────────────────────────────────────────────────────
-- 10. RPC FUNCTION: Referral Reward (5 referrals = 1 month)
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_referral_and_award(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total INT;
    v_earned INT;
    v_months INT;
    v_current_expiry TIMESTAMPTZ;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    UPDATE users SET total_referrals = total_referrals + 1 WHERE id = p_user_id;
    
    SELECT total_referrals, free_months_earned INTO v_total, v_earned
    FROM users WHERE id = p_user_id;
    
    v_months := FLOOR(v_total / 5);
    
    IF v_months > v_earned THEN
        UPDATE users
        SET free_months_earned = v_months,
            free_months_remaining = v_months
        WHERE id = p_user_id;
        
        SELECT plan_expiry INTO v_current_expiry FROM users WHERE id = p_user_id;
        IF v_current_expiry IS NULL OR v_current_expiry < v_now THEN
            v_current_expiry := v_now;
        END IF;
        
        UPDATE users
        SET plan_expiry = v_current_expiry + ((v_months - v_earned) * INTERVAL '30 days')
        WHERE id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ──────────────────────────────────────────────────────────────
-- 11. INDEXES for Performance
-- ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_status ON links(status);
CREATE INDEX IF NOT EXISTS idx_check_history_link_id ON check_history(link_id);
CREATE INDEX IF NOT EXISTS idx_check_history_checked_at ON check_history(checked_at);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_sent_at ON alerts(sent_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON rate_limits(ip);
