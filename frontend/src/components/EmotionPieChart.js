// components/SentimentPieChart.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const EmotionPieChart = ({ data }) => {

  const emotionColors = {
    joy: {
      border: "1px solid #ffc000",
      color: "#ffc000",
    },
    sadness: {
      border: "1px solid #6FC4D3",
      color: "#6FC4D3",
    },
    anger: {
      border: "1px solid #E06666",
      color: "#E06666",
    },
    fear: {
      border: "1px solid #8e44ad",
      color: "#8e44ad",
    },
    love: {
      border: "1px solid #FF69B4",
      color: "#FF69B4",
    },
    surprise: {
      border: "1px solid #f39c12",
      color: "#f39c12",
    },
  };
    
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: Object.keys(data).map(emotion => emotionColors[emotion]?.color || "#ccc"),
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
    <div style={{ width: '400px', margin: '20px auto', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Emotion Distribution</h3>
      <Pie data={chartData} options={chartOptions}/>  
    </div>
  );
};

export default EmotionPieChart;