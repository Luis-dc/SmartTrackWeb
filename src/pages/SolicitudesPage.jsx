import { useEffect, useState } from 'react'
import SolicitudesFilters from '../components/solicitudes/SolicitudesFilters'
import SolicitudesTable from '../components/solicitudes/SolicitudesTable'
import { getInteresados } from '../services/interesadosApi'

const initialFilters = {
  fromDate: '',
  toDate: '',
  estado: '',
  departamento: '',
  municipio: '',
  idDms: '',
  search: '',
  exported: '',
  page: 1,
  pageSize: 10
}

function SolicitudesPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadData(customFilters = filters) {
    setLoading(true)
    setError('')

    try {
      const data = await getInteresados(customFilters)
      setItems(data.items || [])
      setPagination(
        data.pagination || {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1
        }
      )
    } catch (err) {
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleFilterChange(name, value) {
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  function handleSearch() {
    const nextFilters = {
      ...filters,
      page: 1
    }

    setFilters(nextFilters)
    loadData(nextFilters)
  }

  function handleClear() {
    setFilters(initialFilters)
    loadData(initialFilters)
  }

  function handlePageChange(nextPage) {
    const nextFilters = {
      ...filters,
      page: nextPage
    }

    setFilters(nextFilters)
    loadData(nextFilters)
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Bandeja de interesados</h2>
        <p className="text-muted mb-0">
          Consulta, búsqueda y seguimiento de solicitudes registradas por el bot
        </p>
      </div>

      <SolicitudesFilters
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <SolicitudesTable items={items} loading={loading} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
        <div className="text-muted small">
          Página {pagination.page} de {pagination.totalPages} · Total registros:{' '}
          {pagination.total}
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={loading || pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Anterior
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={loading || pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default SolicitudesPage