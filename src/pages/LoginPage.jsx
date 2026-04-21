import { useState } from 'react'
import { loginRequest } from '../services/authApi'
import { saveAuth } from '../utils/auth'

function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password.trim()) {
      setError('Ingrese correo y contraseña')
      return
    }

    setLoading(true)

    try {
      const data = await loginRequest({
        email: form.email.trim(),
        password: form.password
      })

      saveAuth(data.token, data.user)
      onLoginSuccess(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-bg">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-6 col-lg-5 col-xl-4">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h1 className="h3 mb-2">SmartTrack</h1>
                  <p className="text-muted mb-0">Iniciar sesión</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 btn-lg mt-2"
                    disabled={loading}
                  >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage