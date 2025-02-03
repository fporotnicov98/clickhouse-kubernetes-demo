import express, { Request, Response } from 'express';
import { client, createTableIfNotExists } from './clickhouse';
import cors from 'cors';
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5050;

app.use(cors());
app.use(express.json());

app.get('/data', async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const query = `SELECT * FROM default.sample_table LIMIT ${limit} OFFSET ${offset}`;
    const result = await client.query({ query });
    const data = await result.json();
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate-data', async (req: Request, res: Response) => {
  try {
    const { rows } = req.body;

    // Генерация данных
    const data = Array.from({ length: rows }, (_, i) => ({
      id: i + 1,
      uuid: uuidv4(), // UUID
      value: Math.random() * 1000,
    }));

    await client.insert({
      table: 'default.sample_table',
      values: data,
      format: 'JSONEachRow'
    });

    res.json({ message: `Inserted ${rows} rows` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-table', async (req: Request, res: Response) => {
  try {
    const { engine } = req.body;

    const query = `
      CREATE TABLE IF NOT EXISTS default.sample_table
      (
          id UInt32,
          uuid UUID,
          value Float64
      )
      ENGINE = ${engine}()
      ORDER BY (id);
    `;

    await client.exec({ query });
    console.log(`Table created with engine: ${engine}`);
    res.json({ message: `Table created with engine: ${engine}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/drop-table', async (req: Request, res: Response) => {
  try {
    const query = 'DROP TABLE IF EXISTS default.sample_table;';
    await client.exec({ query });
    res.json({ message: 'Table dropped successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/aggregations', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
          id % 10 AS group_id, 
          avg(value) AS avg_value, 
          min(value) AS min_value, 
          max(value) AS max_value, 
          sum(value) AS sum_value
      FROM default.sample_table
      GROUP BY group_id
      ORDER BY group_id;
    `;
    const result = await client.query({ query });
    const data = await result.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/moving-avg', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
          id, 
          value, 
          avg(value) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg
      FROM default.sample_table
      LIMIT 100;
    `;
    const result = await client.query({ query });
    const data = await result.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/rank', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
          id, 
          value, 
          rank() OVER (ORDER BY value DESC) AS rank
      FROM default.sample_table
      LIMIT 100;
    `;
    const result = await client.query({ query });
    const data = await result.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/cumulative-sum', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
          id, 
          value, 
          sum(value) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_sum
      FROM default.sample_table
      LIMIT 100;
    `;
    const result = await client.query({ query });
    const data = await result.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});