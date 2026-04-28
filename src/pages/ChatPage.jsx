import { useEffect, useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import QuickActions from '../components/QuickActions'
import { sendBotMessage } from '../services/botApi'
import { getOrCreateSession, resetSession } from '../utils/session'
import { clearAuth } from '../utils/auth'

function ChatPage({ user, onLogout, embedded = false, hideLogoutButton = false, hideUserMeta = false}) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggested, setSuggested] = useState(['1', '2', '3', 'menu'])
  const [session, setSession] = useState(getOrCreateSession())

  function addMessage(role, text, links = []) {
    const newMessage = {
      id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role,
      text,
      links
    }

    setMessages((prev) => [...prev, newMessage])
  }

  async function handleSend(customText) {
    const textToSend = (customText ?? input).trim()
    if (!textToSend || loading) return

    addMessage('user', textToSend)
    setInput('')
    setLoading(true)

    try {
      const data = await sendBotMessage({
        channel: 'WEB',
        userId: String(user.id),
        userName: user.name,
        conversationId: session.conversationId,
        text: textToSend,
        payload: {}
      })

      const links =
        data.actions?.filter((item) => item.type === 'url').map((item) => ({
          label: item.label,
          url: item.url
        })) || []

      addMessage('bot', data.text || 'Sin respuesta del bot', links)
      setSuggested(data.suggested || [])
    } catch (error) {
      if (error.code === 'SESSION_EXPIRED') return
      addMessage('bot', 'Ocurrió un error al comunicarse con el bot.')
    } finally {
      setLoading(false)
    }
  }

  async function loadWelcome(currentSession) {
    setLoading(true)

    try {
      const data = await sendBotMessage({
        channel: 'WEB',
        userId: String(user.id),
        userName: user.name,
        conversationId: currentSession.conversationId,
        text: 'menu',
        payload: {}
      })

      const links =
        data.actions?.filter((item) => item.type === 'url').map((item) => ({
          label: item.label,
          url: item.url
        })) || []

      setMessages([
        {
          id: `bot-welcome-${Date.now()}`,
          role: 'bot',
          text: data.text || 'Bienvenido a SmartTrack',
          links
        }
      ])

      setSuggested(data.suggested || [])
    } catch (error) {
      if (error.code === 'SESSION_EXPIRED') return
    
      setMessages([
        {
          id: `bot-error-${Date.now()}`,
          role: 'bot',
          text: 'No se pudo cargar el menú inicial.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleResetConversation() {
    const newSession = resetSession()
    setSession(newSession)
    setMessages([])
    setSuggested(['1', '2', '3', 'menu'])
  }

  function handleLogout() {
    clearAuth()
    onLogout()
  }

  useEffect(() => {
    loadWelcome(session)
  }, [session])

  function handleSubmit(e) {
    e.preventDefault()
    handleSend()
  }

  if (embedded) {
    return (
      <div className="p-4">
        <div className="card border-0 shadow-lg rounded-0 overflow-hidden">
          <div className="card-header bg-smarttrack text-white p-4 border-0">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h2 className="h4 mb-1">SmartTrack Bot</h2>
                <p className="mb-0 opacity-75">
                  Canal web de consulta inicial
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-light fw-semibold"
                  onClick={handleResetConversation}
                >
                  Nueva conversación
                </button>

                {!hideLogoutButton && (
                  <button
                    type="button"
                    className="btn btn-outline-light fw-semibold"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <ChatWindow messages={messages} />
          </div>

          <div className="border-top p-3 bg-white">
            <div className="mb-3">
              <QuickActions
                actions={suggested}
                onSelect={handleSend}
                disabled={loading}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Escribe un mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>

          <div className="card-footer bg-white text-muted small d-flex flex-column flex-md-row justify-content-between gap-2">
            <span>Canal: WEB</span>
            <span>Sesión: {session.conversationId}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-bg">
          <div className="col-12 col-lg-10 col-xl-9">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header bg-smarttrack text-white p-4 border-0">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <h1 className="h3 mb-1">SmartTrack Bot</h1>
                    <p className="mb-0 opacity-75">
                      Canal web de consulta inicial
                    </p>
                    {!hideUserMeta && (
                      <small className="d-block mt-2">
                        {user.name} · {user.role}
                      </small>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-light fw-semibold"
                      onClick={handleResetConversation}
                    >
                      Nueva conversación
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-light fw-semibold"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <ChatWindow messages={messages} />
              </div>

              <div className="border-top p-3 bg-white">
                <div className="mb-3">
                  <QuickActions
                    actions={suggested}
                    onSelect={handleSend}
                    disabled={loading}
                  />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Escribe un mensaje..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-white text-muted small d-flex flex-column flex-md-row justify-content-between gap-2">
                <span>Canal: WEB</span>
                <span>Sesión: {session.conversationId}</span>
              </div>
            </div>
      </div>
    </div>
  )
}

export default ChatPage