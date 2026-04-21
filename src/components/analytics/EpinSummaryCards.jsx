function SummaryCard({ title, value, subtitle }) {
    return (
      <div className="col-12 col-sm-6 col-xl-4">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body">
            <div className="text-muted small mb-2">{title}</div>
            <div className="display-6 fw-semibold mb-1">{value}</div>
            <div className="text-muted small">{subtitle}</div>
          </div>
        </div>
      </div>
    )
  }
  
  function EpinSummaryCards({ summary }) {
    if (!summary) return null
  
    return (
      <div className="row g-3">
        <SummaryCard
          title="Total EPIN"
          value={summary.totalEpins ?? 0}
          subtitle={`Corte: ${summary.asOfDate || 'N/D'}`}
        />
        <SummaryCard
          title="Activos"
          value={summary.activos ?? 0}
          subtitle="Estado actual del último corte"
        />
        <SummaryCard
          title="Bloqueados"
          value={summary.bloqueados ?? 0}
          subtitle="Estado actual del último corte"
        />
      </div>
    )
  }
  
  export default EpinSummaryCards