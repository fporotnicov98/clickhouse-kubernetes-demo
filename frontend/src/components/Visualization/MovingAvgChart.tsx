import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const MovingAvgChart = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://http://backend:5050/moving-avg')
      .then((response) => response.json())
      .then((data) => {
        const chartData = {
          labels: data.map((row: any) => row.id),
          datasets: [
            {
              label: 'Value',
              data: data.map((row: any) => row.value),
              borderColor: '#FF6384',
              fill: false,
            },
            {
              label: 'Moving Average',
              data: data.map((row: any) => row.moving_avg),
              borderColor: '#36A2EB',
              fill: false,
            },
          ],
        };
        setData(chartData);
      });
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Moving Average</h2>
      <Line data={data} />
    </div>
  );
};

export default MovingAvgChart;