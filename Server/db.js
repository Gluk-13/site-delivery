import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'food_delivery',
  password: process.env.DB_PASSWORD || '1833',
  port: process.env.DB_PORT || 5432,
  DATABASE_URL:'postgresql://postgres:1833@localhost:5432/food_delivery',
  connectionString: process.env.DATABASE_URL,
  client_encoding: 'UTF8'
});

// Проверка подключения
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Ошибка подключения к БД:', err);
  } else {
  console.log('Успешное подключение к БД');
  release();
  }
});

export default pool;