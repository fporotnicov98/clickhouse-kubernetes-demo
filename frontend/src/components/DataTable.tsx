import React from 'react';
import { Table, Box } from '@chakra-ui/react';

interface Row {
  id: number;
  uuid: string;
  value: number;
}

interface DataTableProps {
  data: Row[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  console.log(data);
  
  return (
    <Box overflowX="auto" flex={'max-content'} mb={5}>
      <Table.Root size="sm" variant={'outline'}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Uuid</Table.ColumnHeader>
            <Table.ColumnHeader>Value</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row) => (
            <Table.Row key={row.uuid}>
              <Table.Cell>{row.id}</Table.Cell>
              <Table.Cell>{row.uuid}</Table.Cell>
              <Table.Cell>{row.value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default DataTable;