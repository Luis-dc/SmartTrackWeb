import { useEffect, useState } from 'react'
import EpinSummaryCards from '../components/analytics/EpinSummaryCards'
import SegmentTable from '../components/analytics/SegmentTable'
import {
  downloadEpinSegments,
  getEpinRecency,
  getEpinSegments,
  getEpinSummary
} from '../services/analyticsApi'

function AnalisisEpinPage() {
  const [summary, setSummary] = useState(null)
  const [recency, setRecency] = useState([])
  const [segments, setSegments] = useState([])
  const [groupBy, setGroupBy] = useState('departamento')

  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingRecency, setLoadingRecency] = useState(false)
  const [loadingSegments, setLoadingSegments] = useState(false)

  const [error, setError] = useState('')

  async function loadSummary() {
    setLoadingSummary(true)

    try {
      const data = await getEpinSummary()
      setSummary(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingSummary(false)
    }
  }

  async function loadRecency() {
    setLoadingRecency(true)

    try {
      const data = await getEpinRecency()
      setRecency(data.buckets || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingRecency(false)
    }
  }

  async function loadSegments(selectedGroupBy = groupBy) {
    setLoadingSegments(true)

    try {
      const data = await getEpinSegments(selectedGroupBy)
      setSegments(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingSegments(false)
    }
  }

  async function handleDownloadSegments() {
    try {
      await downloadEpinSegments(groupBy)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    setError('')

    async function init() {
      await Promise.all([
        loadSummary(),
        loadRecency(),
        loadSegments('departamento')
      ])
    }

    init()
  }, [])

  useEffect(() => {
    loadSegments(groupBy)
  }, [groupBy])

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Análisis EPIN</h2>
        <p className="text-muted mb-0">
          Resumen del último corte y segmentación EPIN
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loadingSummary ? (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <p className="mb-0">Cargando resumen EPIN...</p>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <EpinSummaryCards summary={summary} />
        </div>
      )}


      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="mb-1">Segmentación EPIN</h5>
            <p className="text-muted small mb-0">
              Vista agregada del último corte por dimensión seleccionada
            </p>
          </div>

          <div className="d-flex gap-2" style={{ minWidth: '320px' }}>
            <select
              className="form-select"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="departamento">Departamento</option>
              <option value="distribuidor">Distribuidor</option>
              <option value="categoria">Tipo PDV</option>
            </select>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleDownloadSegments}
            >
              Descargar
            </button>
          </div>
        </div>

        <div className="card-body">
          <SegmentTable items={segments} loading={loadingSegments} />
        </div>
      </div>
    </div>
  )
}

export default AnalisisEpinPage