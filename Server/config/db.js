import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Определяем хост в зависимости от окружения
const isDocker = process.env.DOCKER_ENV === 'true';
const dbHost = isDocker ? 'postgres' : 'localhost';

const pool = new Pool({
  // Для Docker используем имена сервисов, для разработки - localhost
  user: process.env.DB_USER || 'postgres',
  host: dbHost,
  database: process.env.DB_NAME || 'food_delivery', 
  password: process.env.DB_PASSWORD || '1833',
  port: process.env.DB_PORT || 5432,
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
