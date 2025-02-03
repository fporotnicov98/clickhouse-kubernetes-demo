import { useState } from 'react';
import { Box, Button, VStack, Text, Flex } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2'; // Гистограмма
import { Line } from 'react-chartjs-2'; // Линейный график
import { Pie } from 'react-chartjs-2'; // Круговая диаграмма
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Loader } from './shared';

// Регистрируем необходимые модули для работы с графиками
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

interface QueryResponse {
  labels: string[];
  values: (string | number)[];
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: (string | number)[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth: number;
    fill?: boolean;
  }[];
}

const Visualization = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [query, setQuery] = useState<string>('');
  const [chartType, setChartType] = useState<string>(''); // Храним тип графика
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5050/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data: QueryResponse = await response.json();

      console.log('data', data);

      if (data && Array.isArray(data.labels) && Array.isArray(data.values)) {
        const formattedData: ChartData = {
          labels: data.labels,
          datasets: [
            {
              label: chartType === 'trend' ? 'Average Value per Hour' : chartType === 'unique-uuids' ? 'UUIDs' : 'Values',
              data: data.values,
              backgroundColor:
                chartType === 'trend'
                  ? 'rgba(75, 192, 192, 0.2)'
                  : chartType === 'unique-uuids'
                  ? ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)']
                  : 'rgba(54, 162, 235, 0.2)',
              borderColor:
                chartType === 'trend'
                  ? 'rgba(75, 192, 192, 1)'
                  : chartType === 'unique-uuids'
                  ? ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)']
                  : 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              fill: chartType === 'trend' ? false : true,
            },
          ],
        };
        setChartData(formattedData);
      } else {
        console.error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (type: string) => {
    let query = '';
    setChartType(type);
    
    switch (type) {
      case 'distribution':
        query = `
          SELECT 
            CASE 
              WHEN value BETWEEN 0 AND 100 THEN '0-100'
              WHEN value BETWEEN 101 AND 200 THEN '101-200'
              WHEN value BETWEEN 201 AND 300 THEN '201-300'
              ELSE '300+' 
            END AS value_range,
            COUNT(*) AS count
          FROM default.sample_table
          GROUP BY value_range
        `;
        break;
      case 'trend':
        query = `
          SELECT toStartOfHour(timestamp) AS hour, AVG(value) AS avg_value
          FROM default.sample_table
          GROUP BY hour
          ORDER BY hour
        `;
        break;
      case 'unique-uuids':
        query = `
          SELECT COUNT(DISTINCT uuid) AS unique_uuids, COUNT(uuid) - COUNT(DISTINCT uuid) AS duplicate_uuids
          FROM default.sample_table
        `;
        break;
      default:
        break;
    }

    setQuery(query);
    fetchData(query);
  };

  return (
    <Box p={5}>
      <Flex direction="column" align="start">
        <Text fontSize="xl" mb={4}>Визуализация данных:</Text>

        <VStack align="start">
          <Button onClick={() => handleButtonClick('distribution')}>Распределение значений</Button>
          <Button onClick={() => handleButtonClick('trend')}>Тренды значений по времени</Button>
          <Button onClick={() => handleButtonClick('unique-uuids')}>Уникальные UUID</Button>
        </VStack>

        {query && (
          <Box mt={5}>
            <Text fontSize="md" fontWeight="bold">Запрос к ClickHouse:</Text>
            <SyntaxHighlighter language="sql">
              {query}
            </SyntaxHighlighter>
          </Box>
        )}

        {loading && <Loader />}

        {chartData && !loading && (
          <Box mt={5} width="100%">
            {chartType === 'trend' ? (
              <Line data={chartData} />
            ) : chartType === 'unique-uuids' ? (
              <Pie data={chartData} />
            ) : (
              <Bar data={chartData} />
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Visualization;
