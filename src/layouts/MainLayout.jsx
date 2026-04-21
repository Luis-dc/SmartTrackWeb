import { useState } from 'react'
import Topbar from '../components/layout/Topbar'
import Sidebar from '../components/layout/Sidebar'

function MainLayout({
  user,
  onLogout,
  menuItems,
  activeView,
  onChangeView,
  pageTitle,
  children
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const handleChangeView = (viewKey) => {
    onChangeView(viewKey)
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell-main">
      <Topbar
        user={user}
        onLogout={onLogout}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="main-layout">
        <Sidebar
          menuItems={menuItems}
          activeView={activeView}
          onChangeView={handleChangeView}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />

        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={handleCloseSidebar}
          />
        )}

        <main className="main-content">
          <div className="content-shell">
            <div className="content-body">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout