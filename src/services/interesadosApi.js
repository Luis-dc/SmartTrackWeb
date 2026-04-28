import { apiFetch } from '../utils/apiFetch'

async function parseJson(response, fallbackMessage = 'Error en la solicitud') {
  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || fallbackMessage)
  }

  return data
}

function buildParams(filters = {}) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })

  return params
}

export async function getPeriodosInteresados() {
  const response = await apiFetch('/api/interesados/periodos', {
    method: 'GET'
  })

  return parseJson(response)
}

export async function getResumenER(filters = {}) {
  const params = buildParams(filters)

  const response = await apiFetch(
    `/api/interesados/resumen-er?${params.toString()}`,
    {
      method: 'GET'
    }
  )

  return parseJson(response)
}

export async function getInteresados(filters = {}) {
  const params = buildParams(filters)

  const response = await apiFetch(
    `/api/interesados?${params.toString()}`,
    {
      method: 'GET'
    }
  )

  return parseJson(response)
}

export async function downloadInteresadosExport(filters = {}, format = 'csv') {
  const params = buildParams(filters)
  params.append('format', format)

  const response = await apiFetch(
    `/api/interesados/export?${params.toString()}`,
    {
      method: 'GET'
    }
  )

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