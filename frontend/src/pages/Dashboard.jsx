import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLinks } from '../hooks/useLinks'
import StatsBar from '../components/Dashboard/StatsBar'
import LinksTable from '../components/Dashboard/LinksTable'
import AddLinkModal from '../components/Dashboard/AddLinkModal'
import ImportModal from '../components/Dashboard/ImportModal'
import TagGuardModal from '../components/Dashboard/TagGuardModal'
import PasswordModal from '../components/Dashboard/PasswordModal'
import SettingsSection from '../components/Dashboard/SettingsSection'
import ReferralSection from '../components/Dashboard/ReferralSection'
import Toast from '../components/Dashboard/Toast'
import DeleteConfirmModal from '../components/Dashboard/DeleteConfirmModal'
import { Menu, LogOut, Plus, Download, Shield, LayoutDashboard, Gift, Settings, Home } from 'lucide-react'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { links, loading, fetchLinks, addLink, deleteLink, checkLink, runTagGuard, crawlLinks } = useLinks()
  const [activeFilter, setActiveFilter] = useState(null)
  const [filteredLinks, setFilteredLinks] = useState([])
  const [activeSection, setActiveSection] = useState('links')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [deleteModal, setDeleteModal] = useState({ open: false, linkId: null })
  const [modals, setModals] = useState({
    add: false,
    import: false,
    tagGuard: false,
    password: false,
  })
  const [tagGuardResults, setTagGuardResults] = useState([])

  useEffect(() => {
    if (links.length) {
      setFilteredLinks(activeFilter ? links.filter((l) => l.status === activeFilter) : links)
    } else {
      setFilteredLinks([])
    }
  }, [links, activeFilter])

  // ── Toast System ──────────────────────────────────────────
  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }

  // ── Filter Handler ────────────────────────────────────────
  const handleFilter = (filter) => {
    setActiveFilter(filter === activeFilter ? null : filter)
  }

  // ── Add Link ─────────────────────────────────────────────
  const handleAddLink = async (data) => {
    const result = await addLink(data)
    if (result.success) {
      addToast('Link added successfully!', 'success')
      return result
    } else {
      addToast(result.error || 'Failed to add link', 'error')
      return result
    }
  }

  // ── Check Link ────────────────────────────────────────────
  const handleCheck = async (id) => {
    const result = await checkLink(id)
    if (result.success) {
      addToast(`Status: ${result.data.status}`, result.data.status === 'active' ? 'success' : 'warning')
    } else {
      addToast(result.error || 'Check failed', 'error')
    }
  }

  // ── Delete Link ────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleteModal({ open: true, linkId: id })
  }

  const confirmDelete = async () => {
    const result = await deleteLink(deleteModal.linkId)
    if (result.success) {
      addToast('Link removed', 'success')
    } else {
      addToast(result.error || 'Failed to delete', 'error')
    }
    setDeleteModal({ open: false, linkId: null })
  }

  const cancelDelete = () => {
    setDeleteModal({ open: false, linkId: null })
  }

  // ── Tag Guard ──────────────────────────────────────────────
  const handleTagGuard = async () => {
    const result = await runTagGuard()
    if (result.success) {
      setTagGuardResults(result.data.results || [])
      setModals({ ...modals, tagGuard: true })
    } else {
      addToast(result.error || 'Tag Guard failed', 'error')
    }
  }

  const handleCrawl = async (url) => {
    return await crawlLinks(url)
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const navItems = [
    { id: 'links', label: 'Links', icon: LayoutDashboard },
    { id: 'referral', label: 'Refer & Earn', icon: Gift },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // ── Mobile bottom nav items ──────────────────────────────
  const mobileNavItems = [
    { id: 'links', label: 'Links', icon: LayoutDashboard },
    { id: 'referral', label: 'Refer', icon: Gift },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-bg-deep pb-16 md:pb-0">
      {/* ── Toasts ──────────────────────────────────────────── */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            />
          </div>
        ))}
      </div>

      {/* ── Delete Confirm Modal ────────────────────────────── */}
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-bg-card border-r border-border-subtle transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-border-subtle pb-4 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan to-blue-400 rounded-xl flex items-center justify-center text-black font-extrabold text-sm shadow-lg shadow-cyan/20">
              🛡
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight">AffiGuard</span>
              <span className="block text-[10px] text-text-muted font-medium">Link Monitoring</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    if (window.innerWidth < 1024) setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-cyan-soft text-cyan shadow-sm'
                      : 'text-text-muted hover:text-text-main hover:bg-bg-card2'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1 h-6 bg-cyan rounded-full" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* User & Plan */}
          <div className="border-t border-border-subtle pt-4 mt-4">
            <div className="px-4 py-3 bg-gradient-to-br from-bg-card2 to-bg-card rounded-xl border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-text-muted text-[10px] font-semibold uppercase tracking-wider">Plan</div>
                  <div className="font-bold text-base mt-0.5">{user?.plan?.toUpperCase() || 'Free'}</div>
                </div>
                {user?.plan !== 'free' && user?.days_left !== null && user?.days_left <= 7 && (
                  <div className={`text-xs font-semibold ${user.days_left <= 0 ? 'text-red' : 'text-yellow'}`}>
                    {user.days_left <= 0 ? 'Expired' : `${user.days_left}d`}
                  </div>
                )}
              </div>
              {user?.plan !== 'free' && !user?.plan_active && (
                <button className="w-full mt-3 py-2 bg-red/10 text-red border border-red/25 rounded-lg text-xs font-semibold hover:bg-red/20 transition-colors active:scale-95">
                  Renew Now →
                </button>
              )}
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-text-muted hover:text-red hover:bg-red-bg rounded-xl transition-all duration-200 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Sidebar Backdrop ────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="lg:ml-72 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-bg-deep/80 backdrop-blur-xl border-b border-border-subtle px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-bg-card2 transition-colors active:scale-95"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold">
                {navItems.find((i) => i.id === activeSection)?.label}
              </h1>
              <p className="text-text-muted text-xs hidden sm:block">
                {user?.full_name ? `Welcome back, ${user.full_name}` : `Welcome back, ${user?.email}`}
              </p>
            </div>
          </div>

          {activeSection === 'links' && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setModals({ ...modals, import: true })}
                className="btn-ghost px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm flex items-center gap-1"
                title="Import Links"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={handleTagGuard}
                className="btn-ghost px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm flex items-center gap-1"
                title="Tag Guard"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Tag Guard</span>
              </button>
              <button
                onClick={() => setModals({ ...modals, add: true })}
                className="btn-primary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex items-center gap-1"
                data-add-link
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="p-3 sm:p-4 md:p-6">
          {activeSection === 'links' && (
            <>
              <StatsBar
                links={links}
                onFilter={handleFilter}
                activeFilter={activeFilter}
                addToast={addToast}
              />
              <div className="mt-4 sm:mt-6">
                <LinksTable
                  links={filteredLinks}
                  onCheck={handleCheck}
                  onDelete={handleDelete}
                  loading={loading}
                  addToast={addToast}
                />
              </div>
            </>
          )}
          {activeSection === 'referral' && <ReferralSection addToast={addToast} />}
          {activeSection === 'settings' && <SettingsSection addToast={addToast} />}
        </div>
      </main>

      {/* ── Mobile Bottom Navigation ────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-border-subtle lg:hidden flex items-center justify-around py-1.5 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 ${
                isActive ? 'text-cyan' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && <span className="w-4 h-0.5 bg-cyan rounded-full mt-0.5" />}
            </button>
          )
        })}
      </nav>

      {/* ── Modals ───────────────────────────────────────────── */}
      <AddLinkModal
        isOpen={modals.add}
        onClose={() => setModals({ ...modals, add: false })}
        onAdd={handleAddLink}
      />
      <ImportModal
        isOpen={modals.import}
        onClose={() => setModals({ ...modals, import: false })}
        onCrawl={handleCrawl}
        onAddLinks={addLink}
        addToast={addToast}
      />
      <TagGuardModal
        isOpen={modals.tagGuard}
        onClose={() => setModals({ ...modals, tagGuard: false })}
        results={tagGuardResults}
      />
      <PasswordModal
        isOpen={modals.password}
        onClose={() => setModals({ ...modals, password: false })}
        addToast={addToast}
      />

      {/* Quick Password Button */}
      {activeSection === 'settings' && (
        <button
          onClick={() => setModals({ ...modals, password: true })}
          className="fixed bottom-20 right-4 z-30 bg-cyan text-black p-3 rounded-full shadow-lg shadow-cyan/30 hover:scale-105 transition-all duration-200 active:scale-95 lg:bottom-6 lg:right-6"
          title="Change Password"
        >
          🔑
        </button>
      )}
    </div>
  )
}

export default Dashboard
