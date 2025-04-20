// components/SentimentPieChart.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SentimentPieChart = ({ data }) => {
    
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ['#48ad60','#FF7290'], // adjust colors as needed
      },
    ],
  };

  const chartOptions = {
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        font: {
          weight: 'bold',
          size: 14,
        },
      },
      legend: {
        position: 'bottom',
      },
    },
  };

  if (!data || Object.keys(data).length === 0) {
    return <p style={{ paddingLeft: "20px" }}>No sentiment data available.</p>;
  }

  return (
    <div style={{ width: '400px', margin: '20px auto', textAlign: "center" }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>Sentiment Distribution</h3>
      <Pie data={chartData} options={chartOptions}/>  
    </div>
  );
};

export default SentimentPieChart;