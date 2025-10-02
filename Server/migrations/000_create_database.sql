--Создание бд
SELECT 'CREATE DATABASE food_delivery'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'food_delivery')\gexec

--Подключение
\c food_delivery;