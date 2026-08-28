"""
monitor.py – Multi-layer link health checker

Layer 1: Direct HTTP (fast, lightweight)
Layer 2: Smart Proxy Network (residential IPs to bypass bot detection)
Layer 3: Headless Browser (full JS rendering, fallback)

Returns: { status, response_time, layer_used, error }
"""

import os
import time
import re
import socket
import ipaddress
import requests
from typing import Optional

# ── Out-of-stock keyword patterns ─────────────────────────────────────────────

OOS_PATTERNS = {
    "amazon": [
        r"currently unavailable",
        r"this item is currently unavailable",
        r"out of stock",
        r"in stock.*?soon",
        r"notify me when available",
        r"sign up to be notified",
        r"back in stock",
        r"unavailable",
        r"this item is not available.{0,40}delivery location",
        r"not deliverable to",
        r"cannot be shipped to",
    ],
    "flipkart": [
        r"sold out",
        r"out of stock",
        r"currently unavailable",
        r"notify me",
        r"coming soon",
        r"temporarily unavailable",
    ],
    "generic": [
        r"out of stock",
        r"sold out",
        r"temporarily unavailable",
        r"not available",
        r"item unavailable",
        r"product unavailable",
        r"no longer available",
        r"discontinued",
        r"back order",
        r"pre.?order",
    ],
}

BROKEN_PATTERNS = [
    r"404",
    r"page not found",
    r"link not found",
    r"this page doesn.t exist",
    r"this page is no longer",
    r"product has been removed",
    r"listing removed",
    r"asin.*?is no longer",
]

# ── Amazon "Dogs of Amazon" soft-404 page patterns ────────────────────────────
# YE PATTERNS DETECT HONE PAR AB "OUT_OF_STOCK" RETURN HOGA (BROKEN NAHI)
AMAZON_SOFT_404_PATTERNS = [
    r"looking for something\?",
    r"we.re sorry\.?\s*the web address you entered is not a functioning page",
    r"the web address you entered is not a functioning page on our site",
    r"sorry,?\s*we couldn.t find that page",
    r"try checking the url \(web address\) for misspellings",
    r"or you can use the (?:search box above|navigation) to find what you.re looking for",
    r"sorry\s*[—-]?\s*something went wrong on our end",
    r"please go back and try again",
    r"go to amazon.s? home page",
    r"dogsofamazon",
    r"dogs of amazon",
    r"meet the dogs of amazon",
    r"page is currently unavailable",
    r"we.re working on it",
    r"this item is no longer available",
    r"the page you.re looking for is not available",
    r"the page you requested could not be found",
    r"error code:?\s*404",
    r"http.?\s*404.{0,20}not found",
]

# Amazon bot-block detection
AMAZON_BOT_BLOCK_PATTERNS = [
    r"to discuss automated access to amazon data",
    r"enter the characters you see below",
    r"sorry, we just need to make sure you.re not a robot",
    r"type the characters you see in this image",
    r"automated access to amazon",
    r"api-services-support@amazon\.com",
]

TIMEOUT_SECONDS = 8
PROXY_API_BASE = "http://api.scraperapi.com"
PROXY_ENABLED = bool(os.getenv("PROXY_API_KEY") or os.getenv("SCRAPER_API_KEY"))


# ── Helpers ────────────────────────────────────────────────────────────────────

def _get_platform_patterns(platform: str) -> list[str]:
    p = platform.lower()
    if "amazon" in p:
        return OOS_PATTERNS["amazon"]
    if "flipkart" in p:
        return OOS_PATTERNS["flipkart"]
    return OOS_PATTERNS["generic"]


def _classify_content(html: str, status_code: int, platform: str, url: str = "") -> str:
    """
    Classify page content: active | broken | out_of_stock | error
    
    🔥 AMAZON DOG PAGE FIX: Soft-404 patterns ab "out_of_stock" return karenge
    """
    if status_code in (404, 410, 403, 401):
        return "broken"

    text = html.lower() if html else ""

    # Broken indicators
    for pat in BROKEN_PATTERNS:
        if re.search(pat, text):
            return "broken"

    effective_platform = platform if platform and platform.lower() != "generic" \
        else _detect_platform_from_url(url or "")

    # Amazon: check for bot-block (Layer 1 failed – should retry with proxy)
    if "amazon" in effective_platform.lower():
        for pat in AMAZON_BOT_BLOCK_PATTERNS:
            if re.search(pat, text):
                return "error"

        # ── FIX: Amazon Dog page → "out_of_stock" ──
        # Pehle "broken" tha, ab "out_of_stock" return karega
        for pat in AMAZON_SOFT_404_PATTERNS:
            if re.search(pat, text):
                return "out_of_stock"   # <-- 🔥 CHANGE YAHAN KIYA HAI

    # Out-of-stock
    oos_pats = _get_platform_patterns(effective_platform)
    for pat in oos_pats:
        if re.search(pat, text):
            return "out_of_stock"

    return "active"


def _build_headers() -> dict:
    return {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept": (
            "text/html,application/xhtml+xml,application/xml;"
            "q=0.9,image/avif,image/webp,*/*;q=0.8"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }


# ── SSRF Protection ───────────────────────────────────────────────────────────

def is_safe_url(url: str) -> tuple[bool, str]:
    if not url or not isinstance(url, str):
        return False, "URL is empty"

    normalised = url if "://" in url else "https://" + url

    try:
        from urllib.parse import urlparse
        parsed = urlparse(normalised)
    except Exception:
        return False, "Invalid URL format"

    if parsed.scheme not in ("http", "https"):
        return False, f"Scheme \"{parsed.scheme}\" not allowed"

    hostname = parsed.hostname
    if not hostname:
        return False, "No hostname found"

    if hostname.lower() in ("localhost", "localhost.localdomain"):
        return False, "Private/internal hostname not allowed"

    try:
        ip = ipaddress.ip_address(hostname)
        if (ip.is_loopback or ip.is_private or
                ip.is_link_local or ip.is_reserved or
                not ip.is_global):
            return False, f"Private/reserved IP: {ip}"
        return True, "ok"
    except ValueError:
        pass

    try:
        resolved = socket.gethostbyname(hostname)
        ip = ipaddress.ip_address(resolved)
        if (ip.is_loopback or ip.is_private or
                ip.is_link_local or ip.is_reserved or
                not ip.is_global):
            return False, f"Hostname resolves to private IP ({resolved})"
    except socket.gaierror:
        pass

    return True, "ok"


# ── Layer 1: Direct HTTP ───────────────────────────────────────────────────────

def check_layer1(url: str, platform: str = "generic") -> dict:
    start = time.time()
    try:
        resp = requests.get(
            url,
            headers=_build_headers(),
            timeout=TIMEOUT_SECONDS,
            allow_redirects=True,
        )
        elapsed = int((time.time() - start) * 1000)
        status = _classify_content(resp.text, resp.status_code, platform, resp.url)
        return {
            "status": status,
            "response_time": elapsed,
            "layer_used": "Direct Request",
            "http_code": resp.status_code,
            "error": None,
        }
    except requests.Timeout:
        return {
            "status": "error",
            "response_time": int((time.time() - start) * 1000),
            "layer_used": "Direct Request",
            "http_code": None,
            "error": "Request timed out",
        }
    except Exception as e:
        return {
            "status": "error",
            "response_time": int((time.time() - start) * 1000),
            "layer_used": "Direct Request",
            "http_code": None,
            "error": str(e)[:200],
        }


# ── Layer 2: Smart Proxy Network ─────────────────────────────────────────────

def check_layer2(url: str, platform: str = "generic") -> Optional[dict]:
    api_key = os.getenv("PROXY_API_KEY") or os.getenv("SCRAPER_API_KEY")
    if not api_key:
        return None

    params = {
        "api_key": api_key,
        "url": url,
        "render": "true",
        "country_code": _get_country_code(url),
    }

    start = time.time()
    try:
        resp = requests.get(
            PROXY_API_BASE,
            params=params,
            timeout=60,
        )
        elapsed = int((time.time() - start) * 1000)
        status = _classify_content(resp.text, resp.status_code, platform, url)
        return {
            "status": status,
            "response_time": elapsed,
            "layer_used": "Smart Proxy Network",
            "http_code": resp.status_code,
            "error": None,
        }
    except Exception as e:
        return {
            "status": "error",
            "response_time": int((time.time() - start) * 1000),
            "layer_used": "Smart Proxy Network",
            "http_code": None,
            "error": str(e)[:200],
        }


# ── Layer 3: Headless Browser ─────────────────────────────────────────────────

def check_layer3(url: str, platform: str = "generic") -> Optional[dict]:
    if os.getenv("ENABLE_PLAYWRIGHT", "false").lower() != "true":
        return None

    try:
        from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
    except ImportError:
        return None

    start = time.time()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                ],
            )
            context = browser.new_context(
                user_agent=_build_headers()["User-Agent"],
                locale="en-US",
            )
            page = context.new_page()
            page.set_default_timeout(30_000)

            response = page.goto(url, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)

            html = page.content()
            http_code = response.status if response else 200
            final_url = page.url
            elapsed = int((time.time() - start) * 1000)

            browser.close()

            status = _classify_content(html, http_code, platform, final_url)
            return {
                "status": status,
                "response_time": elapsed,
                "layer_used": "Headless Browser",
                "http_code": http_code,
                "error": None,
            }
    except Exception as e:
        return {
            "status": "error",
            "response_time": int((time.time() - start) * 1000),
            "layer_used": "Headless Browser",
            "http_code": None,
            "error": str(e)[:200],
        }


# ── Main entry point ───────────────────────────────────────────────────────────

def _resolve_shortlink(url: str) -> str:
    try:
        resp = requests.head(
            url, headers=_build_headers(), timeout=5,
            allow_redirects=True,
        )
        return resp.url or url
    except Exception:
        try:
            resp = requests.get(
                url, headers=_build_headers(), timeout=5,
                allow_redirects=True, stream=True,
            )
            resolved = resp.url or url
            resp.close()
            return resolved
        except Exception:
            return url


def check_link(url: str, platform: str = "generic") -> dict:
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    effective_platform = platform
    if not platform or platform.lower() == "generic":
        resolved_url = _resolve_shortlink(url)
        detected = _detect_platform_from_url(resolved_url)
        if detected != "generic":
            effective_platform = detected

    # Layer 1
    result = check_layer1(url, effective_platform)
    if result["status"] in ("active", "broken", "out_of_stock"):
        return result

    # Layer 2 (Smart Proxy Network)
    l2 = check_layer2(url, effective_platform)
    if l2 is not None:
        if l2["status"] in ("active", "broken", "out_of_stock"):
            return l2

    # Layer 3 (Headless Browser)
    l3 = check_layer3(url, effective_platform)
    if l3 is not None:
        return l3

    return result


# ── Tag Guard ─────────────────────────────────────────────────────────────────

_TAG_PATTERNS: dict[str, list[str]] = {
    "amazon":     ["tag=", "ascsubtag="],
    "flipkart":   ["affid=", "affExtParam1=", "fktrp="],
    "shareasale": ["sscid=", "afftrack="],
    "clickbank":  ["hop.clickbank.net"],
    "cj":         ["aid=", "pid="],
    "impact":     ["irclickid=", "irgwc="],
    "generic":    [],
}


def _detect_platform_from_url(url: str) -> str:
    u = url.lower()
    if "amazon." in u or "amzn.to" in u or "amzn.in" in u:
        return "amazon"
    if "flipkart." in u or "fkrt.it" in u:
        return "flipkart"
    if "shareasale" in u:
        return "shareasale"
    if "clickbank" in u:
        return "clickbank"
    if "impact.com" in u:
        return "impact"
    if "cj.com" in u:
        return "cj"
    return "generic"


def _get_country_code(url: str) -> str:
    u = url.lower()
    if any(d in u for d in ("amazon.in", "flipkart.com", "fkrt.it", "snapdeal.com", "meesho.com")):
        return "in"
    return "us"


def _fetch_with_fallback(url: str):
    api_key = os.getenv("PROXY_API_KEY") or os.getenv("SCRAPER_API_KEY")
    try:
        return requests.get(url, headers=_build_headers(), timeout=TIMEOUT_SECONDS, allow_redirects=True)
    except Exception:
        if api_key:
            params = {"api_key": api_key, "url": url, "render": "true"}
            return requests.get(PROXY_API_BASE, params=params, timeout=30, allow_redirects=True)
        raise


def check_tag_guard(original_url: str, platform: str = "generic") -> dict:
    if not original_url.startswith(("http://", "https://")):
        original_url = "https://" + original_url

    try:
        resp = _fetch_with_fallback(original_url)
        final_url = resp.url
    except Exception as e:
        return {"tag_present": None, "tag_found": None, "final_url": None, "error": str(e)[:200]}

    resolved_platform = platform if platform != "generic" \
        else _detect_platform_from_url(final_url) or _detect_platform_from_url(original_url)
    expected_tags = _TAG_PATTERNS.get(resolved_platform, [])

    if not expected_tags:
        return {"tag_present": None, "tag_found": None, "final_url": final_url,
                "error": "Tag Guard not applicable for this platform"}

    combined = original_url + " " + final_url
    for tag in expected_tags:
        if tag.lower() in combined.lower():
            return {"tag_present": True, "tag_found": tag, "final_url": final_url, "error": None}
    return {"tag_present": False, "tag_found": None, "final_url": final_url, "error": None}


# ── Smart Auto-Crawl ──────────────────────────────────────────────────────────

AFFILIATE_DOMAINS = [
    "amazon.in", "amazon.com", "amzn.to", "amzn.in",
    "flipkart.com", "fkrt.it", "shareasale.com", "clickbank.net",
    "cj.com", "anrdoezrs.net", "impact.com", "impactradius.com",
    "awin1.com", "awin.com", "rakuten.com", "linksynergy.com",
]


def _is_affiliate_url(url: str) -> bool:
    u = url.lower()
    return any(d in u for d in AFFILIATE_DOMAINS)


def _guess_platform(url: str) -> str:
    u = url.lower()
    if "amazon." in u or "amzn." in u:
        return "amazon"
    if "flipkart." in u or "fkrt." in u:
        return "flipkart"
    if "shareasale" in u:
        return "shareasale"
    if "clickbank" in u:
        return "clickbank"
    if "cj.com" in u:
        return "cj"
    if "impact" in u:
        return "impact"
    if "awin" in u:
        return "awin"
    return "generic"


def crawl_affiliate_links(page_url: str, max_links: int = 200) -> dict:
    import html as _html
    from urllib.parse import urljoin, urlparse

    if not page_url.startswith(("http://", "https://")):
        page_url = "https://" + page_url

    try:
        resp = _fetch_with_fallback(page_url)
    except Exception as e:
        return {"found": [], "total_on_page": 0, "error": str(e)[:200]}

    if resp.status_code not in (200, 301, 302):
        return {"found": [], "total_on_page": 0, "error": f"Page returned HTTP {resp.status_code}"}

    raw_hrefs = re.findall(r'href=["\']([^"\']+)["\']', resp.text, re.IGNORECASE)
    total_on_page = len(raw_hrefs)
    seen = set()
    found = []

    for href in raw_hrefs:
        href = href.strip()
        if href.startswith("//"):
            href = "https:" + href
        elif href.startswith("/"):
            href = f"{urlparse(page_url).scheme}://{urlparse(page_url).netloc}{href}"
        elif not href.startswith("http"):
            href = urljoin(page_url, href)

        if not _is_affiliate_url(href) or href in seen:
            continue
        seen.add(href)
        if len(found) >= max_links:
            break

        platform = _guess_platform(href)
        try:
            path = urlparse(href).path.rstrip("/").split("/")[-1]
            name = _html.unescape(path.replace("-", " ").replace("_", " "))[:80] or href[:60]
        except Exception:
            name = href[:60]
        found.append({"url": href, "name": name.strip().title() or href[:60], "platform": platform})

    return {"found": found, "total_on_page": total_on_page, "error": None}
