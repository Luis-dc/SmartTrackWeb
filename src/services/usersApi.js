import { getToken } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const token = getToken()
  const isFormData = options.body instanceof FormData

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  })

  if (response.status === 401 || response.status === 403) {
    clearAuth()
    window.location.href = '/'
    return
  }

  let data = {}
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    const text = await response.text()
    data = text ? { error: text } : {}
  }

  if (!response.ok || data?.ok === false) {
    throw new Error(data.error || data.message || 'No se pudo completar la operación')
  }

  return data
}

export async function getUsers(filters = {}) {
  const params = new URLSearchParams()

  if (filters.q) params.set('q', filters.q)
  if (filters.role) params.set('role', filters.role)
  if (filters.region) params.set('region', filters.region)
  if (filters.includeInactive) params.set('includeInactive', '1')

  const query = params.toString()
  const data = await request(`/api/users${query ? `?${query}` : ''}`, {
    method: 'GET'
  })

  return data.data || []
}

export async function createUser(payload) {
  const data = await request('/api/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

  return data.data
}

export async function updateUser(userId, payload) {
  const data = await request(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

  return data.data
}

export async function deleteUser(userId) {
  return request(`/api/users/${userId}`, {
    method: 'DELETE'
  })
}