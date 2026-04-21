function Sidebar({ menuItems, activeView, onChangeView, isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-mobile-top">
        <span className="sidebar-mobile-title">Menú</span>
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`sidebar-link ${activeView === item.key ? 'active' : ''}`}
            onClick={() => onChangeView(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar