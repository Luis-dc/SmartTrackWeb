function DeltaText({ value, percentage, favorableWhen = 'up' }) {
  const sign = value > 0 ? '+' : ''

  let tone = 'text-muted'

  if (value !== 0) {
    const isFavorable =
      (favorableWhen === 'up' && value > 0) ||
      (favorableWhen === 'down' && value < 0)

    tone = isFavorable ? 'text-success' : 'text-danger'
  }

  return (
    <div className={`small fw-semibold ${tone}`}>
      {sign}
      {value} · {sign}
      {percentage}%
    </div>
  )
}

function TrendCard({
  title,
  currentValue,
  previousValue,
  delta,
  percentage,
  favorableWhen = 'up'
}) {
  return (
    <div className="col-12 col-md-6">
      <div className="card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body">
          <div className="text-muted small mb-2">{title}</div>
          <div className="display-6 fw-semibold mb-2">{currentValue}</div>
          <div className="text-muted small mb-1">
            Corte anterior: {previousValue ?? 'N/D'}
          </div>
          <DeltaText
            value={delta ?? 0}
            percentage={percentage ?? 0}
            favorableWhen={favorableWhen}
          />
        </div>
      </div>
    </div>
  )
}

function TrendComparisonCards({ data, loading = false }) {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <p className="mb-0">Cargando comparativo...</p>
        </div>
      </div>
    )
  }

  if (!data?.current) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <p className="mb-0">No hay información comparativa disponible.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="row g-3">
      <TrendCard
        title="Activos"
        currentValue={data.current?.activos ?? 0}
        previousValue={data.previous?.activos ?? null}
        delta={data.comparison?.activosDelta ?? 0}
        percentage={data.comparison?.activosPct ?? 0}
        favorableWhen="up"
      />
      <TrendCard
        title="Bloqueados"
        currentValue={data.current?.bloqueados ?? 0}
        previousValue={data.previous?.bloqueados ?? null}
        delta={data.comparison?.bloqueadosDelta ?? 0}
        percentage={data.comparison?.bloqueadosPct ?? 0}
        favorableWhen="down"
      />
    </div>
  )
}

export default TrendComparisonCards