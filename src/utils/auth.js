const TOKEN_KEY = 'smarttrack_token'
const USER_KEY = 'smarttrack_user'

let logoutDispatched = false

export function saveAuth(token, user) {
  logoutDispatched = false
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    )

    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    )

    return JSON.parse(json)
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  if (!token) return true

  const payload = decodeJwtPayload(token)

  if (!payload?.exp) return false

  return Date.now() >= payload.exp * 1000
}

export function forceLogout(reason = 'SESSION_EXPIRED') {
  clearAuth()

  if (logoutDispatched) return
  logoutDispatched = true

  window.dispatchEvent(
    new CustomEvent('auth:logout', {
      detail: { reason }
    })
  )
}

export function isAuthenticated() {
  const token = getToken()

  if (!token) return false

  if (isTokenExpired(token)) {
    clearAuth()
    return false
  }

  return true
}