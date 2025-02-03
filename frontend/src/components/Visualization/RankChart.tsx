import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const RankChart = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://http://backend:5050/rank')
      .then((response) => response.json())
      .then((data) => {
        const chartData = {
          labels: data.map((row: any) => row.id),
          datasets: [
            {
              label: 'Value',
              data: data.map((row: any) => row.value),
              backgroundColor: '#FF6384',
            },
            {
              label: 'Rank',
              data: data.map((row: any) => row.rank),
              backgroundColor: '#36A2EB',
            },
          ],
        };
        setData(chartData);
      });
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Rank by Value</h2>
      <Bar data={data} />
    </div>
  );
};

export default RankChart;