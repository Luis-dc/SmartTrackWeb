function SolicitudesFilters({ filters, onChange, onSearch, onClear, loading }) {
    function handleInputChange(e) {
      const { name, value } = e.target
      onChange(name, value)
    }
  
    function handleSubmit(e) {
      e.preventDefault()
      onSearch()
    }
  
    return (
      <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <label className="form-label">Desde</label>
              <input
                type="date"
                name="fromDate"
                className="form-control"
                value={filters.fromDate}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
  
            <div className="col-12 col-md-3">
              <label className="form-label">Hasta</label>
              <input
                type="date"
                name="toDate"
                className="form-control"
                value={filters.toDate}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
  
            <div className="col-12 col-md-3">
              <label className="form-label">Estado</label>
              <select
                name="estado"
                className="form-select"
                value={filters.estado}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Todos</option>
                <option value="NUEVA">NUEVA</option>
                <option value="EN_PROCESO">EN_PROCESO</option>
                <option value="CERRADA">CERRADA</option>
                <option value="EXPORTADA">EXPORTADA</option>
              </select>
            </div>
  
            <div className="col-12 col-md-3">
              <label className="form-label">Exportado</label>
              <select
                name="exported"
                className="form-select"
                value={filters.exported}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Todos</option>
                <option value="YES">Sí</option>
                <option value="NO">No</option>
              </select>
            </div>
  
            <div className="col-12 col-md-3">
              <label className="form-label">Departamento</label>
              <input
                type="text"
                name="departamento"
                className="form-control"
                value={filters.departamento}
                onChange={handleInputChange}
                placeholder="Departamento"
                disabled={loading}
              />
            </div>
  
            <div className="col-12 col-md-3">
              <label className="form-label">Municipio</label>
              <input
                type="text"
                name="municipio"
                className="form-control"
                value={filters.municipio}
                onChange={handleInputChange}
                placeholder="Municipio"
                disabled={loading}
              />
            </div>
  
            <div className="col-12 col-md-3">
              <label className="form-label">ID DMS</label>
              <input
                type="text"
                name="idDms"
                className="form-control"
                value={filters.idDms}
                onChange={handleInputChange}
                placeholder="ID DMS"
                disabled={loading}
              />
            </div>
  
            <div className="col-12 col-md-3">
              <label className="form-label">Búsqueda</label>
              <input
                type="text"
                name="search"
                className="form-control"
                value={filters.search}
                onChange={handleInputChange}
                placeholder="EPIN, PDV, propietario..."
                disabled={loading}
              />
            </div>
          </div>
  
          <div className="d-flex flex-wrap gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
  
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClear}
              disabled={loading}
            >
              Limpiar
            </button>
          </div>
        </div>
      </form>
    )
  }
  
  export default SolicitudesFilters