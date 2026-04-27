import { getToken } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL

async function parseJson(response) {
  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo obtener la información analítica')
  }

  return data
}

export async function getEpinSummary() {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/analytics/epin/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  return parseJson(response)
}

export async function getEpinRecency() {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/analytics/epin/recency`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  return parseJson(response)
}


export async function getEpinSegments(groupBy = 'departamento') {
    const token = getToken()
  
    const response = await fetch(
      `${API_URL}/api/analytics/epin/segments?groupBy=${groupBy}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )
  
    return parseJson(response)
}

export async function downloadEpinSegments(groupBy = 'departamento') {
    const token = getToken()
  
    const response = await fetch(
      `${API_URL}/api/analytics/epin/segments/export?groupBy=${groupBy}`,
      {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )
  
    if (!response.ok) {
      let message = 'No se pudo descargar la segmentación'
      try {
        const data = await response.json()
        message = data.error || message
      } catch (_) {}
      throw new Error(message)
    }
  
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
  
    const contentDisposition = response.headers.get('Content-Disposition') || ''
    const match = contentDisposition.match(/filename="(.+)"/)
    const fileName = match?.[1] || `segmentacion_epin_${groupBy}.xlsx`
  
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  
    window.URL.revokeObjectURL(url)
}

export async function getEpinTrends(limit = 12) {
    const token = getToken()
  
    const response = await fetch(
      `${API_URL}/api/analytics/epin/trends?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )
  
    return parseJson(response)
}
  
export async function getEpinTrendComparison() {
    const token = getToken()
  
    const response = await fetch(
      `${API_URL}/api/analytics/epin/trends/comparison`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )
    if (response.status === 401 || response.status === 403) {
      clearAuth()
      window.location.href = '/'
      return
    }
  
    return parseJson(response)
}