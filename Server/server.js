const express = require('express'); //фреймворк
const ViteExpress = require('vite-express'); //связь с vite
const cors = require('cors'); //хз пока, не вникал
const path = require('path') // нужна для разрешения использовать папку со статичными файлами фронту
require('dotenv').config(); // очередной конфиг а вот че он делает...

const app = express(); //Приложение

app.use(cors()); 
app.use(express.json()); //

const productsRoutes = require('./rootes/products'); 
app.use('/api/products', productsRoutes); //доступ к продуктам по этому пути для фронта
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads'))); //Даю доступ к папке с картинками фронту

app.get('/api/test', (req, res) => {
    res.json ({messege: 'Сервер работает!'}); //тест с api просто чтобы видеть в терминале что сервер работает
})

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Проверить его можно здесь: http://localhost:${PORT}/api/test`);
});

