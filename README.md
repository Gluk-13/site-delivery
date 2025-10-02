# Food Delivery Client

SPA (React/Express/PostgreSQL/Redis) приложение по доставке еды.



Верстка: 
1.Переменные размеров универсальные и расчитываются по calc(var(--size-base || --font-size)*?)
2.Все стили модульные SCSS файлы
3.Все подходы по использованию правильных SEO тегов соблюдены
4.Классы написаны по методологии БЭМ
5.Базовые стили подключены в main.jsx, а находятся cd:"client/src/global"

Frontend:
1.React и его библиотеки (React-Router, React-Leaflet)
2.Vite
3.Использование React Hooks (useState, useMemo, useEffect)
4.Использование кастомных хуков cd:"client/src/hooks"
5.Переиспользуемые компоненты, вот несколько из них cd:"client/src/components/HomePage/section/components"

Backend: 
1.Express и библиотеки (cors, bcryptjs, ioredis, jsonwebtoken, pg, multer) 
2.Реализовано подключение к двум бд и клиенту.
3.Реализовы токены аутинтификации
4.Реализовано хэширование паролей
5.Реализован мидлвар по защите API маршрутов с клиента

Redis: 
1.

Postgres: 
1.

Git: 
1.Conventional Commits 

feat:    Новая функциональность
fix:     Исправление бага
docs:    Документация
style:   Форматирование
refactor: Рефакторинг
test:    Тесты
chore:   Вспомогательные изменения

## Запуск

1. Установите [Docker](https://docker.com) и [Git](https://git-scm.com)
2. Выполните одну команду:
```bash
git clone https://github.com/Gluk-13/site-delivery.git && cd site-delivery && docker-compose up --build

3. Запуск клиентской части в браузере http://localhost:3000 