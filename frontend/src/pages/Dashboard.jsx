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
import { Menu, LogOut } from 'lucide-react'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { links, loading, fetchLinks, addLink, deleteLink, checkLink, runTagGuard, crawlLinks } = useLinks()
  const [activeFilter, setActiveFilter] = useState(null)
  const [filteredLinks, setFilteredLinks] = useState([])
  const [activeSection, setActiveSection] = useState('links')
  const [modals, setModals] = useState({
    add: false,
    import: false,
    tagGuard: false,
    password: false,
  })
  const [tagGuardResults, setTagGuardResults] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (links.length) {
      setFilteredLinks(activeFilter ? links.filter((l) => l.status === activeFilter) : links)
    } else {
      setFilteredLinks([])
    }
  }, [links, activeFilter])

  const handleFilter = (filter) => {
    setActiveFilter(filter === activeFilter ? null : filter)
  }

  const handleAddLink = async (data) => {
    const result = await addLink(data)
    return result
  }

  const handleCheck = async (id) => {
    await checkLink(id)
    await fetchLinks()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Remove this link from monitoring?')) {
      await deleteLink(id)
      await fetchLinks()
    }
  }

  const handleTagGuard = async () => {
    const result = await runTagGuard()
    if (result.success) {
      setTagGuardResults(result.data.results || [])
      setModals({ ...modals, tagGuard: true })
    } else {
      alert(result.error)
    }
  }

  const handleCrawl = async (url) => {
    return await crawlLinks(url)
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const navItems = [
    { id: 'links', label: 'My Links', icon: '🔗' },
    { id: 'referral', label: 'Refer & Earn', icon: '🎁' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

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

          <div className="border-t border-border-subtle pt-4 mt-4">
            <div className="px-4 py-3 bg-bg-card2 rounded-xl">
              <div className="text-text-muted text-xs font-semibold uppercase tracking-wider">Current Plan</div>
              <div className="font-bold text-lg mt-1">{user?.plan?.toUpperCase() || 'Free'}</div>
              {user?.plan !== 'free' && user?.days_left !== null && user?.days_left <= 7 && (
                <div className={`text-sm ${user.days_left <= 0 ? 'text-red' : 'text-yellow'}`}>
                  {user.days_left <= 0 ? 'Expired!' : `${user.days_left} days left`}
                </div>
              )}
              {user?.plan !== 'free' && !user?.plan_active && (
                <button className="btn-danger w-full mt-3 py-2 text-sm">Renew Now</button>
              )}
            </div>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-red hover:bg-red-bg rounded-xl transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen lg:ml-0">
        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-bg-deep/90 backdrop-blur-xl border-b border-border-subtle px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-bg-card2 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{navItems.find((i) => i.id === activeSection)?.label}</h1>
              <p className="text-text-muted text-sm">Welcome back, {user?.full_name || user?.email}!</p>
            </div>
          </div>
          {activeSection === 'links' && (
            <div className="flex gap-2">
              <button
                onClick={() => setModals({ ...modals, import: true })}
                className="btn-ghost px-4 py-2 text-sm"
              >
                📥 Import
              </button>
              <button
                onClick={handleTagGuard}
                className="btn-ghost px-4 py-2 text-sm"
              >
                🏷️ Tag Guard
              </button>
              <button
                onClick={() => setModals({ ...modals, add: true })}
                className="btn-primary px-4 py-2 text-sm"
              >
                + Add Link
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {activeSection === 'links' && (
            <>
              <StatsBar links={links} onFilter={handleFilter} activeFilter={activeFilter} />
              <LinksTable
                links={filteredLinks}
                onCheck={handleCheck}
                onDelete={handleDelete}
                loading={loading}
              />
            </>
          )}
          {activeSection === 'referral' && <ReferralSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </div>
      </div>

      {/* Modals */}
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
      />
      <TagGuardModal
        isOpen={modals.tagGuard}
        onClose={() => setModals({ ...modals, tagGuard: false })}
        results={tagGuardResults}
      />
      <PasswordModal
        isOpen={modals.password}
        onClose={() => setModals({ ...modals, password: false })}
      />

      {/* Quick access to Password modal from Settings */}
      {activeSection === 'settings' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setModals({ ...modals, password: true })}
            className="bg-cyan text-black p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            🔑
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard
