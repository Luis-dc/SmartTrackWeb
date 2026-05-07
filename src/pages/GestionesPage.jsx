import { useEffect, useMemo, useState } from 'react'
import ResumenERTable from '../components/interesados/ResumenERTable'
import {
  getPeriodosInteresados,
  getResumenER,
  downloadInteresadosExport
} from '../services/interesadosApi'
import {
  getPeriodosCasosPuntuales,
  getResumenERCasosPuntuales,
  downloadCasosPuntualesExport
} from '../services/casosPuntualesApi'

const TAB_CONFIG = {
  interesados: {
    title: 'Interesados por ejecutivo',
    description:
      'Consulta los Interesados registrados desde el bot SmartTrack por cada ER.',
    tableTitle: 'Ejecutivos y cantidad de interesados',
    totalLabel: 'Total interesados',
    totalKey: 'total_interesados',
    selectedLabel: 'Ejecutivo seleccionado',
    getPeriodos: getPeriodosInteresados,
    getResumen: getResumenER,
    downloadExport: downloadInteresadosExport,
    allowCsv: true,
    excelOnly: false,
    radioName: 'selected-er-interesados',
    emptyText: 'No se encontraron ejecutivos con interesados para mostrar.'
  },
  casos: {
    title: 'Casos puntuales por ejecutivo',
    description:
      'Consulta los casos puntuales registrados desde el bot SmartTrack por cada ER.',
    tableTitle: 'Ejecutivos y cantidad de casos puntuales',
    totalLabel: 'Total casos puntuales',
    totalKey: 'total_casos_puntuales',
    selectedLabel: 'Ejecutivo seleccionado',
    getPeriodos: getPeriodosCasosPuntuales,
    getResumen: getResumenERCasosPuntuales,
    downloadExport: downloadCasosPuntualesExport,
    allowCsv: false,
    excelOnly: true,
    radioName: 'selected-er-casos',
    emptyText: 'No se encontraron ejecutivos con casos puntuales para mostrar.'
  }
}

function GestionResumenPanel({ config }) {
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
    const data = await config.getPeriodos()

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
      const data = await config.getResumen({ year, month })
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
      setSelectedER(null)
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

  async function handleDownloadExecutive(format = 'xlsx') {
    if (!selectedER) return

    setExporting(true)
    setError('')

    try {
      await config.downloadExport(
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

  async function handleDownloadAll(format = 'xlsx') {
    setExporting(true)
    setError('')

    try {
      await config.downloadExport(
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
    <>
      <div className="mb-4">
        <h2 className="mb-1">{config.title}</h2>
        <p className="text-muted mb-0">{config.description}</p>
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
          title={config.tableTitle}
          totalLabel={config.totalLabel}
          totalKey={config.totalKey}
          radioName={config.radioName}
          emptyText={config.emptyText}
        />
      </div>

      {selectedER && (
        <div className="alert alert-info mt-4" role="alert">
          {config.selectedLabel}: <strong>{selectedER.name}</strong> · Región:{' '}
          <strong>{selectedER.region || 'N/D'}</strong>
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
              {config.allowCsv && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleDownloadExecutive('csv')}
                  disabled={!selectedER || exporting}
                >
                  Descargar CSV del ejecutivo
                </button>
              )}

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => handleDownloadExecutive('xlsx')}
                disabled={!selectedER || exporting}
              >
                Descargar Excel del ejecutivo
              </button>

              {config.allowCsv && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleDownloadAll('csv')}
                  disabled={exporting}
                >
                  Descargar CSV general
                </button>
              )}

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
    </>
  )
}

function GestionesPage() {
  const [activeTab, setActiveTab] = useState('interesados')
  const config = TAB_CONFIG[activeTab]

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Gestiones</h2>
        <p className="text-muted mb-0">
          Consulta los registros generados desde el bot SmartTrack.
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${
                activeTab === 'interesados' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setActiveTab('interesados')}
            >
              Interesados
            </button>

            <button
              type="button"
              className={`btn ${
                activeTab === 'casos' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setActiveTab('casos')}
            >
              Casos Puntuales
            </button>
          </div>
        </div>
      </div>

      <GestionResumenPanel key={activeTab} config={config} />
    </div>
  )
}

export default GestionesPage