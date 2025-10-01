FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install \
    && npm cache clean --force

COPY . .

# Добавим логирование
RUN echo "Содержимое папки:" && ls -la

EXPOSE 4201

ENV NODE_ENV=development

# Запуск с логированием
CMD ["sh", "-c", "echo '🚀 Запуск сервера...' && node server.js"]