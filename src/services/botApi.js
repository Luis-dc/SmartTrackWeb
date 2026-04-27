import { getToken } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL

export async function sendBotMessage(body) {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/bot/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  })
  if (response.status === 401 || response.status === 403) {
    clearAuth()
    window.location.href = '/'
    return
  }
  
  if (!response.ok) {
    throw new Error('No se pudo comunicar con el bot')
  }

  return response.json()
}