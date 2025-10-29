import app from './app.js';

const PORT = process.env.PORT || 4200;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Проверить его можно здесь: http://localhost:${PORT}/api/test`);
});