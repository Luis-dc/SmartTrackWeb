import { apiFetch } from '../utils/apiFetch'

export async function sendBotMessage(body) {
  const response = await apiFetch('/api/bot/message', {
    method: 'POST',
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('No se pudo comunicar con el bot')
  }

  return response.json()
}