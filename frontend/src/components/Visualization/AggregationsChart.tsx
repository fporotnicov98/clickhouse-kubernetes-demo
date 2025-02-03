import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const AggregationsChart = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5050/aggregations')
      .then((response) => response.json())
      .then((data) => {
        const chartData = {
          labels: data.map((row: any) => `Group ${row.group_id}`),
          datasets: [
            {
              label: 'Average Value',
              data: data.map((row: any) => row.avg_value),
              backgroundColor: '#FF6384',
            },
            {
              label: 'Min Value',
              data: data.map((row: any) => row.min_value),
              backgroundColor: '#36A2EB',
            },
            {
              label: 'Max Value',
              data: data.map((row: any) => row.max_value),
              backgroundColor: '#FFCE56',
            },
            {
              label: 'Sum Value',
              data: data.map((row: any) => row.sum_value),
              backgroundColor: '#4BC0C0',
            },
          ],
        };
        setData(chartData);
      });
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Aggregations by Group</h2>
      <Bar data={data} />
    </div>
  );
};

export default AggregationsChart;