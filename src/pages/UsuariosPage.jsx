import { useEffect, useMemo, useState } from 'react'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/usersApi'

const REGIONS = ['Central', 'Oriente', 'Occidente']
const ADMIN_ROLE_OPTIONS = ['ADMIN', 'SUPERVISOR', 'ER']

function getEmptyForm(user) {
  return {
    name: '',
    email: '',
    password: '',
    role: user?.role === 'SUPERVISOR' ? 'ER' : 'ER',
    region: user?.role === 'SUPERVISOR' ? (user.region || '') : '',
    is_active: 1
  }
}

function UsuariosPage({ user }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    q: '',
    role: '',
    region: '',
    includeInactive: false
  })

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(getEmptyForm(user))

  const isAdmin = user?.role === 'ADMIN'
  const isSupervisor = user?.role === 'SUPERVISOR'

  const roleOptions = useMemo(() => {
    if (isSupervisor) return ['ER']
    return ADMIN_ROLE_OPTIONS
  }, [isSupervisor])

  async function loadUsers(customFilters = filters) {
    try {
      setLoading(true)
      setError('')
      const data = await getUsers(customFilters)
      setRows(data)
    } catch (err) {
      setError(err.message || 'No se pudo cargar la lista de usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openCreateModal() {
    setEditingUser(null)
    setForm(getEmptyForm(user))
    setError('')
    setSuccess('')
    setShowModal(true)
  }

  function openEditModal(row) {
    setEditingUser(row)
    setForm({
      name: row.name || '',
      email: row.email || '',
      password: '',
      role: row.role || 'ER',
      region: row.region || '',
      is_active: Number(row.is_active) === 1 ? 1 : 0
    })
    setError('')
    setSuccess('')
    setShowModal(true)
  }

  function closeModal() {
    if (saving) return
    setShowModal(false)
    setEditingUser(null)
    setForm(getEmptyForm(user))
  }

  function handleFilterSubmit(e) {
    e.preventDefault()

    const nextFilters = {
      ...filters,
      q: search.trim()
    }

    setFilters(nextFilters)
    loadUsers(nextFilters)
  }

  function handleInputChange(e) {
    const { name, value } = e.target

    setForm((prev) => {
      const next = { ...prev, [name]: value }

      if (isSupervisor) {
        next.role = 'ER'
        next.region = user.region || ''
      }

      if (isAdmin && name === 'role' && value === 'ADMIN') {
        next.region = ''
      }

      return next
    })
  }

  async function handleSave(e) {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: isSupervisor ? 'ER' : form.role,
        region: isSupervisor ? (user.region || '') : (form.region || null),
        is_active: Number(form.is_active)
      }

      if (form.password.trim()) {
        payload.password = form.password.trim()
      }

      if (!editingUser && !payload.password) {
        throw new Error('La contraseña es obligatoria al crear un usuario.')
      }

      if (editingUser) {
        await updateUser(editingUser.id, payload)
        setSuccess('Usuario actualizado correctamente.')
      } else {
        await createUser(payload)
        setSuccess('Usuario creado correctamente.')
      }

      closeModal()
      loadUsers()
    } catch (err) {
      setError(err.message || 'No se pudo guardar el usuario.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(row) {
    const confirmed = window.confirm(
      `¿Deseas desactivar al usuario "${row.name}"?`
    )

    if (!confirmed) return

    try {
      setError('')
      setSuccess('')
      await deleteUser(row.id)
      setSuccess('Usuario desactivado correctamente.')
      loadUsers()
    } catch (err) {
      setError(err.message || 'No se pudo desactivar el usuario.')
    }
  }

  if (user?.role === 'ER') {
    return (
      <div className="alert alert-warning mb-0">
        No tienes permisos para acceder a este módulo.
      </div>
    )
  }

  return (
    <>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <h4 className="mb-1">Gestión de usuarios</h4>
              <div className="text-muted small">
                {isAdmin
                  ? 'Administra administradores, supervisores y ER.'
                  : `Gestiona los ER de la región ${user.region || 'Sin región'}.`}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={openCreateModal}
            >
              Crear usuario
            </button>
          </div>

          {(error || success) && (
            <div className="mb-3">
              {error && (
                <div className="alert alert-danger mb-2">{error}</div>
              )}

              {success && (
                <div className="alert alert-success mb-0">{success}</div>
              )}
            </div>
          )}

          <form
            className="row g-3 align-items-end mb-4"
            onSubmit={handleFilterSubmit}
          >
            <div className="col-12 col-lg-4">
              <label className="form-label">Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre o correo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {isAdmin && (
              <>
                <div className="col-12 col-md-6 col-lg-2">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    value={filters.role}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, role: e.target.value }))
                    }
                  >
                    <option value="">Todos</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="ER">ER</option>
                  </select>
                </div>

                <div className="col-12 col-md-6 col-lg-2">
                  <label className="form-label">Región</label>
                  <select
                    className="form-select"
                    value={filters.region}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, region: e.target.value }))
                    }
                  >
                    <option value="">Todas</option>
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-lg-2">
                  <div className="form-check mt-4">
                    <input
                      id="includeInactive"
                      type="checkbox"
                      className="form-check-input"
                      checked={filters.includeInactive}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          includeInactive: e.target.checked
                        }))
                      }
                    />
                    <label htmlFor="includeInactive" className="form-check-label">
                      Incluir inactivos
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="col-12 col-lg-2 d-grid">
              <button type="submit" className="btn btn-outline-primary">
                Filtrar
              </button>
            </div>
          </form>

          {loading ? (
            <div className="text-muted">Cargando usuarios...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Región</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No hay usuarios para mostrar.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.name}</td>
                        <td>{row.email}</td>
                        <td>{row.role}</td>
                        <td>{row.region || 'Sin región'}</td>
                        <td>
                          <span
                            className={`badge ${
                              Number(row.is_active) === 1
                                ? 'bg-success-subtle text-success-emphasis'
                                : 'bg-secondary-subtle text-secondary-emphasis'
                            }`}
                          >
                            {Number(row.is_active) === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEditModal(row)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(row)}
                              disabled={Number(row.is_active) !== 1}
                            >
                              Desactivar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingUser ? 'Editar usuario' : 'Crear usuario'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={saving}
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Correo</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        {editingUser
                          ? 'Nueva contraseña (opcional)'
                          : 'Contraseña'}
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={form.password}
                        onChange={handleInputChange}
                        required={!editingUser}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Rol</label>
                      <select
                        name="role"
                        className="form-select"
                        value={isSupervisor ? 'ER' : form.role}
                        onChange={handleInputChange}
                        disabled={isSupervisor}
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Región</label>
                      <select
                        name="region"
                        className="form-select"
                        value={isSupervisor ? (user.region || '') : form.region}
                        onChange={handleInputChange}
                        disabled={isSupervisor || (!isSupervisor && form.role === 'ADMIN')}
                        required={form.role !== 'ADMIN'}
                      >
                        <option value="">
                          {form.role === 'ADMIN' ? 'Sin región' : 'Seleccione'}
                        </option>
                        {REGIONS.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>

                    {isAdmin && editingUser && (
                      <div className="col-12">
                        <label className="form-label">Estado</label>
                        <select
                          name="is_active"
                          className="form-select"
                          value={String(form.is_active)}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              is_active: Number(e.target.value)
                            }))
                          }
                        >
                          <option value="1">Activo</option>
                          <option value="0">Inactivo</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UsuariosPage