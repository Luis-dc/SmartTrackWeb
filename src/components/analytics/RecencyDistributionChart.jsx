import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  import { Bar } from 'react-chartjs-2'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  )
  
  function RecencyDistributionChart({ data = [], loading = false }) {
    if (loading) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">Cargando distribución de recencia...</p>
          </div>
        </div>
      )
    }
  
    if (!data.length) {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <p className="mb-0">No hay datos de recencia para mostrar.</p>
          </div>
        </div>
      )
    }
  
    const labels = data.map((item) => item.label)
    const values = data.map((item) => Number(item.value || 0))
  
    const chartData = {
      labels,
      datasets: [
        {
          label: 'EPIN',
          data: values,
          backgroundColor: 'rgba(13, 110, 253, 0.7)',
          borderColor: 'rgba(13, 110, 253, 1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    }
  
    const options = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        },
        tooltip: {
          mode: 'nearest',
          intersect: true
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      }
    }
  
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="mb-1">Distribución de recencia</h5>
          <p className="text-muted small mb-0">
            Clasificación por días desde el último corte en que el EPIN fue visto
          </p>
        </div>
  
        <div className="card-body">
          <div style={{ height: '320px' }}>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    )
  }
  
  export default RecencyDistributionChart