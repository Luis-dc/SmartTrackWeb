import { useEffect, useRef, useState } from 'react'
import {
  getImportHistory,
  getImportStatus,
  startImport
} from '../services/importApi'
import ImportHistoryTable from '../components/imports/ImportHistoryTable'

function ImportPage({ user }) {
  const [bdoFile, setBdoFile] = useState(null)
  const [cnvFile, setCnvFile] = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [polling, setPolling] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [batchInfo, setBatchInfo] = useState(null)
  const [batchStatus, setBatchStatus] = useState(null)

  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const pollingRef = useRef(null)

  useEffect(() => {
    loadHistory()

    return () => {
      stopPolling()
    }
  }, [])

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    setPolling(false)
  }

  async function loadHistory() {
    setHistoryLoading(true)

    try {
      const data = await getImportHistory(20)
      setHistory(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setHistoryLoading(false)
    }
  }

  async function pollBatch(batchId) {
    try {
      const data = await getImportStatus(batchId)
      setBatchStatus(data.batch || null)

      const status = data.batch?.status

      if (status === 'done' || status === 'failed') {
        stopPolling()
        await loadHistory()
      }
    } catch (err) {
      setError(err.message)
      stopPolling()
    }
  }

  function startPolling(batchId) {
    stopPolling()
    setPolling(true)
    pollBatch(batchId)

    pollingRef.current = setInterval(() => {
      pollBatch(batchId)
    }, 3000)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (user?.role !== 'ADMIN') {
      setError('No autorizado')
      return
    }

    if (!bdoFile && !cnvFile) {
      setError('Debes seleccionar al menos un archivo: BDO o 2CNV')
      return
    }

    const formData = new FormData()
    if (bdoFile) formData.append('bdo', bdoFile)
    if (cnvFile) formData.append('cnv', cnvFile)

    setSubmitting(true)

    try {
      const data = await startImport(formData)

      setBatchInfo(data)
      setBatchStatus({
        batch_id: data.batchId,
        as_of_date: data.asOfDate,
        status: 'processing',
        total_rows: 0,
        inserted_rows: 0,
        updated_rows: 0,
        error_rows: 0,
        error_message: null
      })

      setSuccess('Importación iniciada correctamente')
      await loadHistory()
      startPolling(data.batchId)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setBdoFile(null)
    setCnvFile(null)
    setError('')
    setSuccess('')

    const bdoInput = document.getElementById('bdo-file')
    const cnvInput = document.getElementById('cnv-file')

    if (bdoInput) bdoInput.value = ''
    if (cnvInput) cnvInput.value = ''
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="container py-4">
        <div className="alert alert-danger mb-0" role="alert">
          No autorizado.
        </div>
      </div>
    )
  }

  const isBusy = submitting || polling

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Importación de archivos</h2>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-lg-6">
                <label className="form-label fw-semibold">Archivo BDO (.csv)</label>
                <input
                  id="bdo-file"
                  type="file"
                  accept=".csv"
                  className="form-control"
                  onChange={(e) => setBdoFile(e.target.files?.[0] || null)}
                  disabled={isBusy}
                />
                <div className="form-text">
                  Opcional. Si no lo cargas, se reutiliza el último BDO válido.
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <label className="form-label fw-semibold">Archivo 2CNV (.csv)</label>
                <input
                  id="cnv-file"
                  type="file"
                  accept=".csv"
                  className="form-control"
                  onChange={(e) => setCnvFile(e.target.files?.[0] || null)}
                  disabled={isBusy}
                />
                <div className="form-text">
                  Opcional. Si no lo cargas, se reutiliza el último 2CNV válido.
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex flex-wrap gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isBusy}
              >
                {submitting ? 'Iniciando importación...' : 'Iniciar importación'}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
                disabled={submitting}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {polling && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body d-flex align-items-center gap-3">
            <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
            <div>
              <div className="fw-semibold">Procesando importación...</div>
              <div className="text-muted small">
                Esto puede tardar 1 o 2 minutos según el volumen del archivo.
              </div>
            </div>
          </div>
        </div>
      )}

      {batchInfo && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <h5 className="mb-3">Última importación iniciada</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div><strong>Batch ID:</strong> {batchInfo.batchId}</div>
              </div>
              <div className="col-md-4">
                <div><strong>Fecha de corte:</strong> {batchInfo.asOfDate}</div>
              </div>
              <div className="col-md-4">
                <div>
                  <strong>Recibidos:</strong>{' '}
                  {[
                    batchInfo.received?.bdo ? 'BDO' : null,
                    batchInfo.received?.cnv ? '2CNV' : null
                  ]
                    .filter(Boolean)
                    .join(' + ') || 'Ninguno'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {batchStatus && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <h5 className="mb-3">Estado del batch</h5>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <div><strong>Status:</strong> {batchStatus.status}</div>
              </div>
              <div className="col-md-4">
                <div><strong>Fecha corte:</strong> {batchStatus.as_of_date || 'N/D'}</div>
              </div>
              <div className="col-md-4">
                <div><strong>Total rows:</strong> {batchStatus.total_rows ?? 0}</div>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <div><strong>Insertadas:</strong> {batchStatus.inserted_rows ?? 0}</div>
              </div>
              <div className="col-md-4">
                <div><strong>Actualizadas:</strong> {batchStatus.updated_rows ?? 0}</div>
              </div>
              <div className="col-md-4">
                <div><strong>Error rows:</strong> {batchStatus.error_rows ?? 0}</div>
              </div>
            </div>

            <div>
              <strong>Error:</strong> {batchStatus.error_message || 'Ninguno'}
            </div>
          </div>
        </div>
      )}

      <ImportHistoryTable
        items={history}
        loading={historyLoading}
        currentBatchId={batchInfo?.batchId || batchStatus?.batch_id}
      />
    </div>
  )
}

export default ImportPage