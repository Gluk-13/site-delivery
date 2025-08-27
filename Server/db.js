const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'food_delivery',
  password: process.env.DB_PASSWORD || '1833',
  port: process.env.DB_PORT || 5432,
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

module.exports = pool;