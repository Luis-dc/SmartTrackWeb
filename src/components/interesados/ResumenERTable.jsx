const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
]

function HeaderPeriodSelectors({
  selectedMonth,
  selectedYear,
  months,
  years,
  onMonthChange,
  onYearChange
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'nowrap'
      }}
    >
      <select
        className="form-select"
        style={{ width: '180px', minWidth: '180px' }}
        value={selectedMonth || ''}
        onChange={(e) => onMonthChange(Number(e.target.value))}
      >
        {months.map((monthNumber) => {
          const month = MONTHS.find((m) => m.value === Number(monthNumber))
          return (
            <option key={monthNumber} value={monthNumber}>
              {month?.label || monthNumber}
            </option>
          )
        })}
      </select>

      <select
        className="form-select"
        style={{ width: '120px', minWidth: '120px' }}
        value={selectedYear || ''}
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}

function ResumenERTable({
  items = [],
  loading,
  onSelectER,
  selectedErId,
  selectedMonth,
  selectedYear,
  months,
  years,
  onMonthChange,
  onYearChange,

  title = 'Ejecutivos y cantidad de interesados',
  subtitle = 'El resumen mostrado corresponde al periodo seleccionado',
  totalLabel = 'Total interesados',
  totalKey = 'total_interesados',
  loadingText = 'Cargando ejecutivos...',
  emptyText = 'No se encontraron ejecutivos para mostrar.',
  radioName = 'selected-er'
}) {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <p className="mb-0">{loadingText}</p>
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <h5 className="mb-1">{title}</h5>
              <p className="text-muted mb-0 small">
                Selecciona un periodo para visualizar los resultados
              </p>
            </div>

            <HeaderPeriodSelectors
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              months={months}
              years={years}
              onMonthChange={onMonthChange}
              onYearChange={onYearChange}
            />
          </div>
        </div>

        <div className="card-body">
          <p className="mb-0">{emptyText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-header bg-white border-0 pt-4 px-4">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h5 className="mb-1">{title}</h5>
            <p className="text-muted mb-0 small">{subtitle}</p>
          </div>

          <HeaderPeriodSelectors
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            months={months}
            years={years}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}
          />
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '60px' }} className="text-center"></th>
                <th>ER</th>
                <th>Correo</th>
                <th>Región</th>
                <th>{totalLabel}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isSelected = Number(selectedErId) === Number(item.web_user_id)

                return (
                  <tr
                    key={item.web_user_id}
                    className={isSelected ? 'table-primary' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectER(item)}
                  >
                    <td className="text-center">
                      <input
                        type="radio"
                        name={radioName}
                        className="form-check-input"
                        checked={isSelected}
                        onChange={() => onSelectER(item)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>{item.name || 'N/D'}</td>
                    <td>{item.email || 'N/D'}</td>
                    <td>{item.region || 'N/D'}</td>
                    <td>{item[totalKey] ?? 0}</td>
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

export default ResumenERTable