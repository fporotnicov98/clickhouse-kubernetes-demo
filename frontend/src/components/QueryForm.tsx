import React, { useState } from 'react';
import { Box, Input, Button, VStack, Text, Flex } from '@chakra-ui/react';

interface Row {
  id: number;
  value: number;
}
interface QueryFormProps {
  onGenerateData: (rows: number) => void;
  deleteTable: () => void;
  isGenerated: boolean;
  data: Row[];
}

const QueryForm: React.FC<QueryFormProps> = ({ onGenerateData, deleteTable, isGenerated,   data }) => {
  const [rows, setRows] = useState<number>(500);

  return (
    <Box mt={5}>
      <Text fontSize="lg" fontWeight="bold" mb={5}>Генерация данных:</Text>
      <VStack align="start">
        <Input
          type="number"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          placeholder="Number of rows"
        />
        <Flex alignItems={'center'} mt={'5'} mb={'5'} gap={'5'}>
          <Button onClick={() => onGenerateData(rows)} disabled={isGenerated}>Сгенерировать</Button>
          <Button onClick={deleteTable} disabled={!data.length}>Удалить таблицу</Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default QueryForm;