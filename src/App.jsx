import { useEffect, useMemo, useState } from 'react'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import InteresadosPage from './pages/InteresadosPage'
import ImportPage from './pages/ImportPage'
import MainLayout from './layouts/MainLayout'
import { clearAuth, getUser, isAuthenticated } from './utils/auth'
import AnalisisEpinPage from './pages/AnalisisEpinPage'
import TendenciasPage from './pages/TendenciasPage'

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [user, setUser] = useState(getUser())
  const [activeView, setActiveView] = useState('chat')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleLoginSuccess(loggedUser) {
    setUser(loggedUser)
    setAuthenticated(true)
    setActiveView('chat')
  }

  function handleLogout() {
    clearAuth()
    setUser(null)
    setAuthenticated(false)
    setActiveView('chat')
  }

  const menuItems = useMemo(() => {
    if (!user) return []

    const items = [{ key: 'chat', label: 'Chatbot' }]

    if (user.role === 'SUPERVISOR' || user.role === 'ADMIN') {
      items.push({ key: 'interesados', label: 'Interesados' })
      items.push({ key: 'analisis-epin', label: 'Análisis EPIN' })
      items.push({ key: 'tendencias', label: 'Tendencias' })
    }

    if (user.role === 'ADMIN') {
      items.push({ key: 'importaciones', label: 'Importaciones' })
    }

    return items
  }, [user])

  const pageTitle = useMemo(() => {
    switch (activeView) {
      case 'interesados':
        return 'Interesados'
      case 'analisis-epin':
        return 'Análisis EPIN'
      case 'importaciones':
        return 'Importaciones'
      case 'tendencias':
        return 'Tendencias'
      case 'chat':
      default:
        return 'Chatbot'
    }
  }, [activeView])

  function renderView() {
    switch (activeView) {
      case 'interesados':
        return <InteresadosPage />
      case 'analisis-epin':
        return <AnalisisEpinPage />
      case 'importaciones':
        return <ImportPage user={user} />
      case 'tendencias':
        return <TendenciasPage />
      case 'chat':
      default:
        return (
          <ChatPage
            user={user}
            onLogout={handleLogout}
            embedded
            hideLogoutButton
            hideUserMeta
          />
        )
    }
  }

  if (!authenticated || !user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  if (user.role === 'ER' && activeView === 'chat' && isMobile) {
    return (
      <ChatPage
        user={user}
        onLogout={handleLogout}
        fullScreenEr
      />
    )
  }

  return (
    <MainLayout
      user={user}
      onLogout={handleLogout}
      menuItems={menuItems}
      activeView={activeView}
      onChangeView={setActiveView}
      pageTitle={pageTitle}
    >
      {renderView()}
    </MainLayout>
  )
}

export default App