import { apiFetch } from '../utils/apiFetch'

async function parseJson(response, fallbackMessage) {
  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || fallbackMessage)
  }

  return data
}

export async function startImport(formData) {
  const response = await apiFetch('/import', {
    method: 'POST',
    body: formData
  })

  return parseJson(response, 'No se pudo iniciar la importación')
}

export async function getImportStatus(batchId) {
  const response = await apiFetch(`/import/status/${batchId}`, {
    method: 'GET'
  })

  return parseJson(response, 'No se pudo consultar el estado del batch')
}

export async function getImportHistory(limit = 20) {
  const response = await apiFetch(`/import/history?limit=${limit}`, {
    method: 'GET'
  })

  return parseJson(response, 'No se pudo obtener el historial')
}