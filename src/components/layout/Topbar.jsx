import { useState } from 'react'

function Topbar({ user, onLogout, onToggleSidebar }) {
  const [openUserMenu, setOpenUserMenu] = useState(false)

  function toggleUserMenu() {
    setOpenUserMenu((prev) => !prev)
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <div className="topbar-brand-block">
          <div className="topbar-brand-title">SmartTrack Web</div>
          <div className="topbar-brand-subtitle">
            Canal web de consulta
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="topbar-actions desktop-only">
        <div className="topbar-user-card">
          <div className="topbar-user-name">{user.name}</div>
          <div className="topbar-user-meta">
            {user.role} · {user.region || 'Sin región'}
          </div>
        </div>

        <button
          type="button"
          className="topbar-logout-btn"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Móvil */}
      <div className="topbar-user-dropdown mobile-only">
        <button
          type="button"
          className="topbar-user-toggle"
          onClick={toggleUserMenu}
        >
          {user.name} {openUserMenu ? '▴' : '▾'}
        </button>

        {openUserMenu && (
          <div className="topbar-user-menu">
            <button
              type="button"
              className="topbar-logout-btn"
              onClick={onLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Topbar