function formatDate(value) {
    if (!value) return 'N/D'
  
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
  
    return date.toLocaleString()
  }
  
  function getStatusBadgeClass(status) {
    switch (status) {
      case 'done':
        return 'text-bg-success'
      case 'failed':
        return 'text-bg-danger'
      case 'processing':
        return 'text-bg-warning'
      default:
        return 'text-bg-secondary'
    }
  }
  
  function ImportHistoryTable({ items = [], loading, currentBatchId }) {
    if (loading) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">Cargando historial...</p>
          </div>
        </div>
      )
    }
  
    if (!items.length) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">No hay importaciones registradas.</p>
          </div>
        </div>
      )
    }
  
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="mb-1">Historial de importaciones</h5>
          <p className="text-muted small mb-0">
            Últimos batches procesados
          </p>
        </div>
  
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Batch</th>
                  <th>Fecha corte</th>
                  <th>Estado</th>
                  <th>Ejecutado</th>
                  <th>Subido por</th>
                  <th>Origen</th>
                  <th>Total rows</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isCurrent = Number(currentBatchId) === Number(item.batch_id)
  
                  return (
                    <tr key={item.batch_id} className={isCurrent ? 'table-primary' : ''}>
                      <td>{item.batch_id}</td>
                      <td>{item.as_of_date ? String(item.as_of_date).slice(0, 10) : 'N/D'}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                          {item.status || 'N/D'}
                        </span>
                      </td>
                      <td>{formatDate(item.created_at)}</td>
                      <td>{item.uploaded_by || 'N/D'}</td>
                      <td style={{ minWidth: '260px' }}>{item.source_path || item.source || 'N/D'}</td>
                      <td>{item.total_rows ?? 0}</td>
                      <td style={{ minWidth: '220px' }}>{item.error_message || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  
  export default ImportHistoryTable