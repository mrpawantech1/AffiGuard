import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user`, {
        withCredentials: true,
      })
      setUser(response.data)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/login`,
        { email, password },
        { withCredentials: true }
      )
      setUser(response.data)
      navigate('/dashboard')
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed. Please try again.',
      }
    }
  }

  const signup = async (email, password, fullName, referralCode) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/signup`,
        { email, password, full_name: fullName, referral_code: referralCode },
        { withCredentials: true }
      )
      setUser(response.data)
      navigate('/dashboard')
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Signup failed. Please try again.',
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/logout`,
        {},
        { withCredentials: true }
      )
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      navigate('/login')
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/forgot-password`,
        { email },
        { withCredentials: true }
      )
      return { success: true, message: response.data.message }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Something went wrong.',
      }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/reset-password`,
        { token, password: newPassword },
        { withCredentials: true }
      )
      return { success: true, message: response.data.message }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Reset failed. Please try again.',
      }
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    fetchUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
