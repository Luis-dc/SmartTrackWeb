const API_URL = import.meta.env.VITE_API_URL

export async function loginRequest(body) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo iniciar sesión')
  }

  return data
}