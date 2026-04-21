import { getToken } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL

export async function startImport(formData) {
  const token = getToken()

  const response = await fetch(`${API_URL}/import`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo iniciar la importación')
  }

  return data
}

export async function getImportStatus(batchId) {
  const token = getToken()

  const response = await fetch(`${API_URL}/import/status/${batchId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo consultar el estado del batch')
  }

  return data
}

export async function getImportHistory(limit = 20) {
  const token = getToken()

  const response = await fetch(`${API_URL}/import/history?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo obtener el historial')
  }

  return data
}