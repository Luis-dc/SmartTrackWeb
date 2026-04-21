function formatSaldo(value) {
    if (value === null || value === undefined) return 'N/D'
    return Number(value).toFixed(2)
  }
  
  function ReviewCandidatesTable({
    items = [],
    loading = false,
    pagination,
    onPageChange
  }) {
    if (loading) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">Cargando candidatos a revisión...</p>
          </div>
        </div>
      )
    }
  
    if (!items.length) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">No hay candidatos a revisión para mostrar.</p>
          </div>
        </div>
      )
    }
  
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>EPIN</th>
                  <th>ID DMS</th>
                  <th>Estado</th>
                  <th>Saldo</th>
                  <th>Frecuencia</th>
                  <th>PDV</th>
                  <th>Departamento</th>
                  <th>Distribuidor</th>
                  <th>Tipo PDV</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.epin}>
                    <td>{item.epin || 'N/D'}</td>
                    <td>{item.id_dms || 'N/D'}</td>
                    <td>{item.estadoEpin || 'N/D'}</td>
                    <td>{formatSaldo(item.saldoEpin)}</td>
                    <td>{item.frequencyCount ?? 0}</td>
                    <td>{item.nombrePdv || 'N/D'}</td>
                    <td>{item.departamento || 'N/D'}</td>
                    <td>{item.distribuidor || 'N/D'}</td>
                    <td>{item.categoria || 'N/D'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        <div className="card-footer bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="text-muted small">
            Página {pagination?.page || 1} de {pagination?.totalPages || 1} · Total registros: {pagination?.total || 0}
          </div>
  
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={!pagination || pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Anterior
            </button>
  
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={!pagination || pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default ReviewCandidatesTable