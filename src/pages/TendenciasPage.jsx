import { useEffect, useState } from 'react'
import TrendComparisonCards from '../components/analytics/TrendComparisonCards'
import TrendSeriesChart from '../components/analytics/TrendSeriesChart'
import { getEpinTrendComparison, getEpinTrends } from '../services/analyticsApi'

function TendenciasPage() {
  const [series, setSeries] = useState([])
  const [comparison, setComparison] = useState(null)

  const [loadingSeries, setLoadingSeries] = useState(false)
  const [loadingComparison, setLoadingComparison] = useState(false)

  const [error, setError] = useState('')

  async function loadSeries() {
    setLoadingSeries(true)

    try {
      const data = await getEpinTrends(12)
      setSeries(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingSeries(false)
    }
  }

  async function loadComparison() {
    setLoadingComparison(true)

    try {
      const data = await getEpinTrendComparison()
      setComparison(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingComparison(false)
    }
  }

  useEffect(() => {
    setError('')

    async function init() {
      await Promise.all([loadSeries(), loadComparison()])
    }

    init()
  }, [])

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-1">Tendencias</h2>
        <p className="text-muted mb-0">
          Evolución de activos y bloqueados por cortes disponibles
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <TrendComparisonCards data={comparison} loading={loadingComparison} />
      </div>

      <TrendSeriesChart items={series} loading={loadingSeries} />
    </div>
  )
}

export default TendenciasPage