import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Запуск миграций...');
    
    // Создаем таблицу для отслеживания миграций
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Получаем выполненные миграции
    const { rows: executedMigrations } = await client.query(
      'SELECT name FROM migrations ORDER BY name'
    );
    
    const executedNames = new Set(executedMigrations.map(m => m.name));
    
    // Читаем файлы миграций из папки migrations
    const migrationsDir = path.join(__dirname, '../migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      console.log('📁 Папка migrations не найдена, создаем базовые таблицы...');
      await createBasicTables(client);
      return;
    }
    
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`📁 Найдено ${files.length} файлов миграций`);
    
    if (files.length === 0) {
      console.log('📝 Миграций не найдено, создаем базовые таблицы...');
      await createBasicTables(client);
      return;
    }
    
    for (const file of files) {
      if (!executedNames.has(file)) {
        console.log(`📦 Выполняем миграцию: ${file}`);
        
        const migrationPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(migrationPath, 'utf8');
        
        await client.query(sql);
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        
        console.log(`✅ Миграция ${file} выполнена`);
      } else {
        console.log(`⏭️ Миграция ${file} уже выполнена`);
      }
    }
    
    console.log('🎉 Все миграции завершены!');
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграций:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Функция для создания базовых таблиц если миграций нет
async function createBasicTables(client) {
  console.log('🔧 Создаем базовые таблицы...');
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      phone VARCHAR(50),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Таблица users создана');
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(500) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Таблица sessions создана');

  await client.query(
    'INSERT INTO migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
    ['001_basic_tables.sql']
  );
}

runMigrations().catch(process.exit);