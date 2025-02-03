import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const CumulativeSumChart = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5050/cumulative-sum')
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
              label: 'Cumulative Sum',
              data: data.map((row: any) => row.cumulative_sum),
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
      <h2>Cumulative Sum</h2>
      <Line data={data} />
    </div>
  );
};

export default CumulativeSumChart;