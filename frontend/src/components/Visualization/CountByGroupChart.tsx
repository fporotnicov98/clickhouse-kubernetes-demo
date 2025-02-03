import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const CountByGroupChart = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5050/count-by-group')
      .then((response) => response.json())
      .then((data) => {
        const chartData = {
          labels: data.map((row: any) => `Group ${row.group_id}`),
          datasets: [
            {
              data: data.map((row: any) => row.count),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
              ],
            },
          ],
        };
        setData(chartData);
      });
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Count by Group</h2>
      <Pie data={data} />
    </div>
  );
};

export default CountByGroupChart;