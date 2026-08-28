import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Get admin secret from localStorage
const getAdminSecret = () => localStorage.getItem('admin_secret') || ''

export const adminApi = {
  // Auth
  login: (secret) => {
    localStorage.setItem('admin_secret', secret)
  },
  logout: () => {
    localStorage.removeItem('admin_secret')
  },
  isAuthenticated: () => !!localStorage.getItem('admin_secret'),

  // Headers
  _headers: () => ({
    'Content-Type': 'application/json',
    'X-Admin-Secret': getAdminSecret(),
  }),

  // Stats
  getStats: async () => {
    const res = await axios.get(`${API_URL}/api/admin/stats`, {
      headers: adminApi._headers(),
    })
    return res.data
  },

  // Users
  getUsers: async (page = 1, search = '', plan = '') => {
    const params = new URLSearchParams({ page, per_page: 20 })
    if (search) params.append('search', search)
    if (plan) params.append('plan', plan)
    const res = await axios.get(`${API_URL}/api/admin/users?${params}`, {
      headers: adminApi._headers(),
    })
    return res.data
  },

  getUser: async (userId) => {
    const res = await axios.get(`${API_URL}/api/admin/users/${userId}`, {
      headers: adminApi._headers(),
    })
    return res.data
  },

  updateUserPlan: async (userId, data) => {
    const res = await axios.post(
      `${API_URL}/api/admin/users/${userId}/plan`,
      data,
      { headers: adminApi._headers() }
    )
    return res.data
  },

  suspendUser: async (userId, suspend = true) => {
    const res = await axios.post(
      `${API_URL}/api/admin/users/${userId}/suspend`,
      { suspend },
      { headers: adminApi._headers() }
    )
    return res.data
  },

  deleteUser: async (userId) => {
    const res = await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
      headers: adminApi._headers(),
    })
    return res.data
  },

  sendMessage: async (userId, message) => {
    const res = await axios.post(
      `${API_URL}/api/admin/users/${userId}/message`,
      { message },
      { headers: adminApi._headers() }
    )
    return res.data
  },

  // Payments
  getPayments: async (page = 1) => {
    const res = await axios.get(
      `${API_URL}/api/admin/payments?page=${page}&per_page=50`,
      { headers: adminApi._headers() }
    )
    return res.data
  },

  recordPayment: async (data) => {
    const res = await axios.post(
      `${API_URL}/api/admin/payments`,
      data,
      { headers: adminApi._headers() }
    )
    return res.data
  },

  // Coupons
  getCoupons: async () => {
    const res = await axios.get(`${API_URL}/api/admin/coupons`, {
      headers: adminApi._headers(),
    })
    return res.data
  },

  createCoupon: async (data) => {
    const res = await axios.post(
      `${API_URL}/api/admin/coupons`,
      data,
      { headers: adminApi._headers() }
    )
    return res.data
  },

  deleteCoupon: async (couponId) => {
    const res = await axios.delete(`${API_URL}/api/admin/coupons/${couponId}`, {
      headers: adminApi._headers(),
    })
    return res.data
  },

  // Broadcast
  broadcast: async (message, paidOnly = false) => {
    const res = await axios.post(
      `${API_URL}/api/admin/broadcast`,
      { message, paid_only: paidOnly },
      { headers: adminApi._headers() }
    )
    return res.data
  },

  // Links
  getAdminLinks: async (page = 1, status = '') => {
    const params = new URLSearchParams({ page, per_page: 50 })
    if (status) params.append('status', status)
    const res = await axios.get(`${API_URL}/api/admin/links?${params}`, {
      headers: adminApi._headers(),
    })
    return res.data
  },

  recheckLink: async (linkId) => {
    const res = await axios.post(
      `${API_URL}/api/admin/links/${linkId}/recheck`,
      {},
      { headers: adminApi._headers() }
    )
    return res.data
  },

  // Feedback
  getFeedback: async (page = 1) => {
    const res = await axios.get(
      `${API_URL}/api/admin/feedback?page=${page}&per_page=20`,
      { headers: adminApi._headers() }
    )
    return res.data
  },

  // Health
  getHealth: async () => {
    const res = await axios.get(`${API_URL}/api/admin/health`, {
      headers: adminApi._headers(),
    })
    return res.data
  },

  // Export
  exportUsers: async () => {
    const res = await axios.get(`${API_URL}/api/admin/export/users`, {
      headers: adminApi._headers(),
      responseType: 'blob',
    })
    return res.data
  },

  // Recent signups
  getRecentSignups: async () => {
    const res = await axios.get(`${API_URL}/api/admin/recent-signups?limit=30`, {
      headers: adminApi._headers(),
    })
    return res.data
  },
  }
