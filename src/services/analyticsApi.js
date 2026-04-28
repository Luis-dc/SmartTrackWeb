import { apiFetch } from '../utils/apiFetch'

async function parseJson(response, fallbackMessage = 'No se pudo obtener la información analítica') {
  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || fallbackMessage)
  }

  return data
}

export async function getEpinSummary() {
  const response = await apiFetch('/api/analytics/epin/summary', {
    method: 'GET'
  })

  return parseJson(response)
}

export async function getEpinRecency() {
  const response = await apiFetch('/api/analytics/epin/recency', {
    method: 'GET'
  })

  return parseJson(response)
}

export async function getEpinSegments(groupBy = 'departamento') {
  const response = await apiFetch(
    `/api/analytics/epin/segments?groupBy=${encodeURIComponent(groupBy)}`,
    {
      method: 'GET'
    }
  )

  return parseJson(response)
}

export async function downloadEpinSegments(groupBy = 'departamento') {
  const response = await apiFetch(
    `/api/analytics/epin/segments/export?groupBy=${encodeURIComponent(groupBy)}`,
    {
      method: 'GET'
    }
  )

  if (!response.ok) {
    let message = 'No se pudo descargar la segmentación'

    try {
      const data = await response.json()
      message = data.error || message
    } catch {
      // noop
    }

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
  const response = await apiFetch(
    `/api/analytics/epin/trends?limit=${encodeURIComponent(limit)}`,
    {
      method: 'GET'
    }
  )

  return parseJson(response)
}

export async function getEpinTrendComparison() {
  const response = await apiFetch('/api/analytics/epin/trends/comparison', {
    method: 'GET'
  })

  return parseJson(response)
}