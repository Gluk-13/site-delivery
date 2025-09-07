import express from 'express'; //фреймворк
import ViteExpress from 'vite-express'; //связь с vite
import cors from 'cors'; //хз пока, не вникал
import path from 'path'; // нужна для разрешения использовать папку со статичными файлами фронту
import 'dotenv/config'; // очередной конфиг а вот че он делает...
import productsRoutes from './rootes/products/products.js';
import authRoutes from './rootes/auth/login.js';
import registerRoutes from './rootes/auth/register.js'
const app = express(); //Приложение

app.use(cors()); 
app.use(express.json()); //

app.use('/api/products', productsRoutes); //доступ к продуктам по этому пути для фронта

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', authRoutes);

app.use('/api/users', registerRoutes)

app.get('/api/test', (req, res) => {
    res.json ({messege: 'Сервер работает!'}); //тест с api просто чтобы видеть в терминале что сервер работает
})

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Проверить его можно здесь: http://localhost:${PORT}/api/test`);
});
