# Food Delivery Client

SPA (React/Express/PostgreSQL/Redis) приложение по доставке еды.

Мой проект решает проблему маштабирования бизнеса в своем магазине.
Мое приложение готово на 90% для бизнеса и маштабирования. Увеличит доход
бизнеса, даст возможность администрировать доставку ,а не просто использовать готовые структуры.

Перед маштабированием я бы точно обдумал:
-Выход на микросервисную архитектуру
-Оптимизацию приложения через:
    -Индексы
    -Lazy-loading
    -Оптимизация самих запросов
-Переход на Scrum или Kanban для планировки
-Переход на axios вместо fetch для ускорения разработки


Верстка: 
1.Переменные размеров универсальные и расчитываются по calc(var(--size-base || --font-size)*?)
2.Все стили модульные SCSS файлы
3.Все подходы по использованию правильных SEO тегов соблюдены
4.Классы написаны по методологии БЭМ
5.Базовые стили подключены в main.jsx, а находятся cd:"client/src/global"

Frontend:
1.React и его библиотеки (React-Router, React-Leaflet, Zustand(но знаю Reux))
2.Vite(но могу по документации работать с webpack)
3.Использование React Hooks (useState, useMemo, useEffect, useNavigate, useRef, useContext)
4.Использование кастомных хуков cd:"client/src/hooks"
5.Переиспользуемые компоненты, вот несколько из них cd:"client/src/components/HomePage/section/components"

Backend: 
1.  Express и библиотеки (cors, bcryptjs, ioredis, jsonwebtoken, pg) 
2.  Реализовано подключение к двум бд и клиенту.
3.  Реализовы токены аутинтификации
4.  Реализовано хэширование паролей
5.  Реализован мидлвар по защите API маршрутов с клиента

Redis: 
1. Написана корзина и избранное по id пользователя
2. Знаю как реализовать решение проблемы с несинхронизированными корзинами между устройствами

Postgres: 
1. Созданы первые миграционные файлы
2. Есть несколько индексов для оптимизации БД

Git:
1.Conventional Commits 

feat:    Новая функциональность
fix:     Исправление бага
docs:    Документация
style:   Форматирование
refactor: Рефакторинг
test:    Тесты
chore:   Вспомогательные изменения

Тесты: 
- Для тестов использовал jest
Запуск через
    - npm start test

                                        ВАЖНО НИЖЕ ДАННЫЕ ДЛЯ ТЕСТОВ: ДЛЯ НАЧАЛА СТОИТ ИСПОЛЬЗОВАТЬ АККАУНТ ПОЛЬЗОВАТЕЛЯ
Админ:
email: admin@test.com
пароль: Admin1234!
role_id: 2

Пользователь:
email: user@test.com
пароль: User1234!
role_id: 1

## Запуск

1. Установите [Docker](https://docker.com) и [Git](https://git-scm.com)
2. Откройте любую IDE или терминал компьютера Linux -bash Windows -PowerShell и выполните эту команду

git clone https://github.com/Gluk-13/site-delivery.git && cd site-delivery && docker-compose up --build

2.1 Или выполните 3 команды по очереди , если прошлая команда не сработала

1) git clone https://github.com/Gluk-13/site-delivery.git
2) cd site-delivery
3) docker-compose up --build

3. Запуск клиентской части в браузере http://localhost:3000
Приступайте к просмотру

## Быстрый деплой (Railway + Netlify)

1) Бэкенд на Railway:
- Deploy из папки `Server/` (Dockerfile уже настроен)
- Добавьте Addons: PostgreSQL и Redis
- Переменные окружения в сервисе Backend:
  - `PORT=4200` (или 8080 и выставьте его в Railway)
  - `DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD` — возьмите из Railway PostgreSQL
  - `REDIS_HOST, REDIS_PORT, REDIS_PASSWORD` — из Railway Redis
  - `JWT_SECRET=<сильный_секрет>`, `NODE_ENV=production`, `DOCKER_ENV=true`
- Включите публичный домен и проверьте `https://<backend>.railway.app/api/test`

2) Фронтенд на Netlify/Vercel:
- Root/Framework: папка `Client`
- Build: `npm ci && npm run build`
- Publish/Output: `dist`
- Env: `VITE_API_URL=https://<backend>.railway.app`
- Деплой и проверка сайта