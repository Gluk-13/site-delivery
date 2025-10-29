import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Определяем хост: приоритет у переменной окружения DB_HOST (Railway Addon)
const isDocker = process.env.DOCKER_ENV === 'true';
const dbHost = process.env.DB_HOST || process.env.PGHOST || (isDocker ? 'postgres' : 'localhost');

const pool = new Pool({
  // Для Docker используем имена сервисов, для разработки - localhost
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  host: dbHost,
  database: process.env.DB_NAME || process.env.PGDATABASE || 'food_delivery', 
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '1833',
  port: Number(process.env.DB_PORT || process.env.PGPORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('Успешное подключение к БД!');
});

pool.on('error', (err) => {
  console.error('Ошибка соединения с БД:', err);
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('База данных подключена успешно!');
    client.release();
  } catch (error) {
    console.error('Ошибка подключения к БД:', error.message);
    // Не выходим из процесса при ошибке, чтобы приложение могло переподключиться
  }
};

testConnection();

export default pool;
