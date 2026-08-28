import React, { useState, useEffect } from 'react'
import { adminApi } from '../utils/adminApi'
import AdminStats from '../components/Admin/AdminStats'
import AdminUsers from '../components/Admin/AdminUsers'
import AdminPayments from '../components/Admin/AdminPayments'
import AdminCoupons from '../components/Admin/AdminCoupons'
import AdminBroadcast from '../components/Admin/AdminBroadcast'
import AdminFeedback from '../components/Admin/AdminFeedback'
import AdminLinks from '../components/Admin/AdminLinks'
import AdminHealth from '../components/Admin/AdminHealth'
import { Menu, LogOut, Shield } from 'lucide-react'

const Admin = () => {
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (adminApi.isAuthenticated()) {
      setAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!secret) return
    try {
      // Test the secret by calling stats
      adminApi.login(secret)
      const stats = await adminApi.getStats()
      if (stats) {
        setAuthenticated(true)
      }
    } catch (err) {
      alert('Invalid admin secret. Access denied.')
      localStorage.removeItem('admin_secret')
    }
  }

  const handleLogout = () => {
    adminApi.logout()
    setAuthenticated(false)
    setSecret('')
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'links', label: 'Links', icon: '🔗' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'coupons', label: 'Coupons', icon: '🏷️' },
    { id: 'broadcast', label: 'Broadcast', icon: '📢' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'health', label: 'System Health', icon: '🩺' },
  ]

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep p-4">
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🛡️</div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-text-muted text-sm mt-1">Internal panel — authorised access only</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter admin secret key"
              className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all mb-4"
              autoFocus
            />
            <button type="submit" className="btn-primary w-full py-3.5">
              Enter Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-card border-r border-border-subtle transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 border-b border-border-subtle pb-4 mb-4">
            <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center text-black font-extrabold text-sm">
              🛡
            </div>
            <span className="text-lg font-extrabold">AffiGuard</span>
            <span className="text-text-muted text-xs ml-auto">Admin</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  if (window.innerWidth < 1024) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeSection === item.id
                    ? 'bg-cyan-soft text-cyan'
                    : 'text-text-muted hover:text-text-main hover:bg-bg-card2'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red hover:bg-red-bg rounded-xl transition-colors border-t border-border-subtle pt-4 mt-4"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen lg:ml-0">
        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-bg-deep/90 backdrop-blur-xl border-b border-border-subtle px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-bg-card2 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">
              {navItems.find((i) => i.id === activeSection)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-sm hidden sm:inline">🟢 All systems OK</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {activeSection === 'dashboard' && <AdminStats />}
          {activeSection === 'users' && <AdminUsers />}
          {activeSection === 'links' && <AdminLinks />}
          {activeSection === 'payments' && <AdminPayments />}
          {activeSection === 'coupons' && <AdminCoupons />}
          {activeSection === 'broadcast' && <AdminBroadcast />}
          {activeSection === 'feedback' && <AdminFeedback />}
          {activeSection === 'health' && <AdminHealth />}
        </div>
      </div>
    </div>
  )
}

export default Admin
