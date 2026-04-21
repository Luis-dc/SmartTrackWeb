import { useEffect, useMemo, useState } from 'react'
import ResumenERTable from '../components/interesados/ResumenERTable'
import {
  getPeriodosInteresados,
  getResumenER,
  downloadInteresadosExport
} from '../services/interesadosApi'

function InteresadosPage() {
  const [resumen, setResumen] = useState([])
  const [selectedER, setSelectedER] = useState(null)
  const [loadingResumen, setLoadingResumen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  const [defaultYear, setDefaultYear] = useState(null)
  const [defaultMonth, setDefaultMonth] = useState(null)
  const [years, setYears] = useState([])
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)

  const availableMonths = useMemo(() => {
    if (!selectedYear || !defaultYear || !defaultMonth) return []

    if (Number(selectedYear) === Number(defaultYear)) {
      return Array.from({ length: defaultMonth }, (_, i) => i + 1)
    }

    return Array.from({ length: 12 }, (_, i) => i + 1)
  }, [selectedYear, defaultYear, defaultMonth])

  async function loadPeriodos() {
    const data = await getPeriodosInteresados()

    setDefaultYear(data.defaultYear)
    setDefaultMonth(data.defaultMonth)
    setYears(data.years || [])
    setSelectedYear(data.defaultYear)
    setSelectedMonth(data.defaultMonth)

    return {
      defaultYear: data.defaultYear,
      defaultMonth: data.defaultMonth
    }
  }

  async function loadResumen(year, month) {
    setLoadingResumen(true)
    setError('')

    try {
      const data = await getResumenER({ year, month })
      setResumen(data.items || [])
    } catch (err) {
      setError(err.message)
      setResumen([])
    } finally {
      setLoadingResumen(false)
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const periodos = await loadPeriodos()
        await loadResumen(periodos.defaultYear, periodos.defaultMonth)
      } catch (err) {
        setError(err.message)
      }
    }

    init()
  }, [])

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      loadResumen(selectedYear, selectedMonth)
    }
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    if (!availableMonths.length) return

    const monthExists = availableMonths.includes(Number(selectedMonth))
    if (!monthExists) {
      setSelectedMonth(availableMonths[availableMonths.length - 1])
    }
  }, [availableMonths, selectedMonth])

  function handleSelectER(er) {
    setSelectedER(er)
  }

  async function handleDownloadExecutive(format) {
    if (!selectedER) return

    setExporting(true)
    setError('')

    try {
      await downloadInteresadosExport(
        {
          createdByWebUserId: selectedER.web_user_id,
          year: selectedYear,
          month: selectedMonth
        },
        format
      )
      await loadResumen(selectedYear, selectedMonth)
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  async function handleDownloadAll(format) {
    setExporting(true)
    setError('')

    try {
      await downloadInteresadosExport(
        {
          year: selectedYear,
          month: selectedMonth
        },
        format
      )
      await loadResumen(selectedYear, selectedMonth)
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Interesados por ejecutivo</h2>
        <p className="text-muted mb-0">
          Supervisa los ER de tu región y consulta los interesados registrados por cada uno
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <ResumenERTable
          items={resumen}
          loading={loadingResumen}
          onSelectER={handleSelectER}
          selectedErId={selectedER?.web_user_id}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          months={availableMonths}
          years={years}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {selectedER && (
        <div className="alert alert-info mt-4" role="alert">
          Ejecutivo seleccionado: <strong>{selectedER.name}</strong> · Región: <strong>{selectedER.region || 'N/D'}</strong>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body">
          <div className="d-flex flex-column gap-3">
            <div>
              <h6 className="mb-1">Descargas</h6>
              <p className="text-muted small mb-0">
                Las descargas se realizan con base en el mes y año seleccionados
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => handleDownloadExecutive('csv')}
                disabled={!selectedER || exporting}
              >
                Descargar CSV del ejecutivo
              </button>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => handleDownloadExecutive('xlsx')}
                disabled={!selectedER || exporting}
              >
                Descargar Excel del ejecutivo
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleDownloadAll('csv')}
                disabled={exporting}
              >
                Descargar CSV general
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleDownloadAll('xlsx')}
                disabled={exporting}
              >
                Descargar Excel general
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteresadosPage