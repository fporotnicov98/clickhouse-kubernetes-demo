import { ClickHouseClient, createClient } from '@clickhouse/client';

const client: ClickHouseClient = createClient({
  host: 'http://localhost:8123',
  username: 'default',
  password: '',
  database: 'default',
});

// Функция для создания таблицы, если она не существует
const createTableIfNotExists = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS default.sample_table
    (
        id UUID,
        value Float64
    )
    ENGINE = MergeTree()
    ORDER BY (id);
  `;

  await client.exec({ query });
  console.log('Table default.sample_table created or already exists.');
};

export { client, createTableIfNotExists };