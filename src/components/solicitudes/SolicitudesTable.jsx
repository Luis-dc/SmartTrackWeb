function formatDate(value) {
    if (!value) return 'N/D'
  
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
  
    return date.toLocaleString()
  }
  
  function SolicitudesTable({ items = [], loading }) {
    if (loading) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">Cargando solicitudes...</p>
          </div>
        </div>
      )
    }
  
    if (!items.length) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">No se encontraron solicitudes.</p>
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
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Canal</th>
                  <th>ID DMS</th>
                  <th>EPIN</th>
                  <th>Nombre PDV</th>
                  <th>Propietario</th>
                  <th>Teléfono</th>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Exportado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.interesado_id}>
                    <td>{item.interesado_id}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>
                      <span className="badge text-bg-secondary">
                        {item.estado || 'N/D'}
                      </span>
                    </td>
                    <td>{item.channel || 'N/D'}</td>
                    <td>{item.id_dms || 'N/D'}</td>
                    <td>{item.epin_reportado || 'N/D'}</td>
                    <td>{item.nombre_pdv || 'N/D'}</td>
                    <td>{item.propietario || 'N/D'}</td>
                    <td>{item.telefono || 'N/D'}</td>
                    <td>{item.departamento || 'N/D'}</td>
                    <td>{item.municipio || 'N/D'}</td>
                    <td>{item.exported_at ? 'Sí' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  
  export default SolicitudesTable