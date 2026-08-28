import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useLinks = () => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_URL}/api/links`, {
        withCredentials: true,
      })
      setLinks(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load links')
    } finally {
      setLoading(false)
    }
  }, [])

  const addLink = async (linkData) => {
    try {
      const response = await axios.post(`${API_URL}/api/links`, linkData, {
        withCredentials: true,
      })
      setLinks((prev) => [response.data, ...prev])
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to add link',
      }
    }
  }

  const deleteLink = async (linkId) => {
    try {
      await axios.delete(`${API_URL}/api/links/${linkId}`, {
        withCredentials: true,
      })
      setLinks((prev) => prev.filter((l) => l.id !== linkId))
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to delete link',
      }
    }
  }

  const checkLink = async (linkId) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/links/${linkId}/check`,
        {},
        { withCredentials: true }
      )
      // Update the link status in the list
      setLinks((prev) =>
        prev.map((l) =>
          l.id === linkId
            ? { ...l, status: response.data.status, last_checked: new Date().toISOString() }
            : l
        )
      )
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Check failed',
      }
    }
  }

  const runTagGuard = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/tag-guard`,
        { check_all: true },
        { withCredentials: true }
      )
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Tag Guard failed',
      }
    }
  }

  const crawlLinks = async (pageUrl) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/crawl-links`,
        { page_url: pageUrl },
        { withCredentials: true }
      )
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Crawl failed',
      }
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return {
    links,
    loading,
    error,
    fetchLinks,
    addLink,
    deleteLink,
    checkLink,
    runTagGuard,
    crawlLinks,
  }
        }
