import { getToken } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL

async function fetchWithAuth(url) {
  const token = getToken()

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Error en la solicitud')
  }

  return data
}

export async function getPeriodosInteresados() {
  return fetchWithAuth(`${API_URL}/api/interesados/periodos`)
}

export async function getResumenER(filters = {}) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })

  return fetchWithAuth(`${API_URL}/api/interesados/resumen-er?${params.toString()}`)
}

export async function downloadInteresadosExport(filters = {}, format = 'csv') {
  const token = getToken()
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })

  params.append('format', format)

  const response = await fetch(`${API_URL}/api/interesados/export?${params.toString()}`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!response.ok) {
    let message = 'No se pudo descargar el archivo'
    try {
      const data = await response.json()
      message = data.error || message
    } catch {
      // noop
    }
    throw new Error(message)
  }

  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="(.+)"/)
  const fileName = match ? match[1] : `interesados.${format}`

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}