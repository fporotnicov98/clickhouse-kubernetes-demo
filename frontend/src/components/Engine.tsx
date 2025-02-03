import { Box, Heading, Flex, HStack } from '@chakra-ui/react';
import DataTable from './DataTable';
import QueryForm from './QueryForm';
import { useEffect, useState } from 'react';
import { ToggleMode } from './ToggleMode';
import { TabsEngine } from './TabsEngine';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination"
import Visualization from './Visualization';

interface Row {
  id: number;
  uuid: string;
  value: number;
}

const pageSize = 10;

const Engine = () => {
  const [data, setData] = useState<Row[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<string>('MergeTree');
  const [page, setPage] = useState(1);
  const [isGenerated, setIsGenerated] = useState(false);

  const fetchData = async (page: number = 1, pageSize: number = 500) => {
    try {
      const response = await fetch(`http://localhost:5050/data?limit=${pageSize}&offset=${(page - 1) * pageSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGenerateData = async (rows: number) => {
    try {
      await fetch('http://localhost:5050/create-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine: selectedEngine }),
      });
      
      await fetch('http://localhost:5050/generate-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });

      fetchData();
      setIsGenerated(true)
    } catch (error) {
      console.error('Error generating data:', error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      await fetch('http://localhost:5050/drop-table', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      setData([])
      setIsGenerated(false)
    } catch (error) {
      console.error('Error generating data:', error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;
  const visibleData = data?.slice(startRange, endRange);

  return (
    <Box p={5}>
      <Flex align={'center'} justifyContent={'space-between'}>
        <Heading as="h1" mb={5}>ClickHouse Demo</Heading>
        <ToggleMode />
      </Flex>

      <TabsEngine onEngineChange={setSelectedEngine} />

      <QueryForm
        onGenerateData={handleGenerateData}
        deleteTable={handleDeleteTable}
        isGenerated={isGenerated}
        data={data}
      />

      <DataTable data={visibleData} />

      <PaginationRoot
        page={page}
        count={data.length}
        pageSize={pageSize}
        onPageChange={(e) => setPage(e.page)}
      >
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>

      <Visualization />
    </Box>
  );
};

export default Engine;