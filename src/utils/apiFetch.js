import { forceLogout, getToken, isTokenExpired } from './auth'

const API_URL = import.meta.env.VITE_API_URL

export class SessionExpiredError extends Error {
  constructor() {
    super('SESSION_EXPIRED')
    this.name = 'SessionExpiredError'
    this.code = 'SESSION_EXPIRED'
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken()

  if (!token || isTokenExpired(token)) {
    forceLogout('SESSION_EXPIRED')
    throw new SessionExpiredError()
  }

  const isFormData = options.body instanceof FormData

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  }

  const url = path.startsWith('http') ? path : `${API_URL}${path}`

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (response.status === 401 || response.status === 403) {
    forceLogout('SESSION_EXPIRED')
    throw new SessionExpiredError()
  }

  return response
}