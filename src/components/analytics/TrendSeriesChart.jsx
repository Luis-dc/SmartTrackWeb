import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  import { Bar } from 'react-chartjs-2'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  )
  
  function TrendSeriesChart({ items = [], loading = false }) {
    if (loading) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">Cargando serie histórica...</p>
          </div>
        </div>
      )
    }
  
    if (!items.length) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">No hay cortes suficientes para mostrar tendencias.</p>
          </div>
        </div>
      )
    }
  
    const labels = items.map((item) => item.label)
    const activos = items.map((item) => Number(item.activos || 0))
    const bloqueados = items.map((item) => Number(item.bloqueados || 0))
  
    const data = {
      labels,
      datasets: [
        {
          label: 'Activos',
          data: activos,
          backgroundColor: 'rgba(13, 110, 253, 0.7)',
          borderColor: 'rgba(13, 110, 253, 1)',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'Bloqueados',
          data: bloqueados,
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    }
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="mb-1">Tendencia por cortes disponibles</h5>
          <p className="text-muted small mb-0">
            Comparación de EPIN activos y bloqueados en cada corte cargado
          </p>
        </div>
  
        <div className="card-body">
          <div style={{ height: '380px' }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    )
  }
  
  export default TrendSeriesChart