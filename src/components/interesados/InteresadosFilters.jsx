function InteresadosFilters({
    filters,
    onChange,
    onSearch,
    onClear,
    loading,
    selectedER
  }) {
    function handleInputChange(e) {
      const { name, value } = e.target
      onChange(name, value)
    }
  
    function handleSubmit(e) {
      e.preventDefault()
      onSearch()
    }
  
    return (
      <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
            <div>
              <h6 className="mb-1">Detalle de interesados</h6>
              <p className="text-muted small mb-0">
                {selectedER
                  ? `Mostrando solicitudes creadas por: ${selectedER.name}`
                  : 'Selecciona un ER para ver el detalle'}
              </p>
            </div>
          </div>
  
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <label className="form-label">Desde</label>
              <input
                type="date"
                name="fromDate"
                className="form-control"
                value={filters.fromDate}
                onChange={handleInputChange}
                disabled={loading || !selectedER}
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
                disabled={loading || !selectedER}
              />
            </div>
          </div>
  
          <div className="d-flex flex-wrap gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !selectedER}
            >
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
  
  export default InteresadosFilters