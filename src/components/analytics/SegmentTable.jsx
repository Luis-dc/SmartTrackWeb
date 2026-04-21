function SegmentTable({ items = [], loading = false }) {
    if (loading) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">Cargando segmentación...</p>
          </div>
        </div>
      )
    }
  
    if (!items.length) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">No hay datos de segmentación para mostrar.</p>
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
                  <th>Segmento</th>
                  <th>Total EPIN</th>
                  <th>Activos</th>
                  <th>Bloqueados</th>
                  <th>% Bloqueado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.segment}>
                    <td>{item.segment || 'Sin dato'}</td>
                    <td>{item.totalEpins ?? 0}</td>
                    <td>{item.activos ?? 0}</td>
                    <td>{item.bloqueados ?? 0}</td>
                    <td>{item.pctBloqueado ?? 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  
  export default SegmentTable