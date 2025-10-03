import express from 'express'; //фреймворк
import cors from 'cors'; //хз пока, не вникал
import path from 'path'; // нужна для разрешения использовать папку со статичными файлами фронту
import 'dotenv/config'; // очередной конфиг а вот че он делает...

import productsRoutes from './routes/products/products.js';//Роут для товаров в приложении(Информация)
import authRoutes from './routes/auth/login.js'; //Все три роута для авторизации 1
import registerRoutes from './routes/auth/register.js'//2
import resetRoutes from './routes/auth/reset.js'//3
import cartRoutes from './routes/cart/cartRoutes.js'
import favourRoutes from './routes/favour/favourRoutes.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//Middleware
app.use(cors()); 
app.use(express.json());

//Routes
app.use('/api/products', productsRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', authRoutes);
app.use('/api/users', registerRoutes);
app.use('/api/users', resetRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favourites', favourRoutes);

//Просто тестовый роут чтобы знать что сервер не лёг
app.get('/api/test', (req, res) => {
    res.json ({messege: 'Сервер работает!'}); //тест с api просто чтобы видеть в терминале что сервер работает
})

export default app;
//Порт сервера, либо прописанный в .env либо 4200 как стандартный
const PORT = process.env.PORT

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 4200;
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
        console.log(`Проверить его можно здесь: http://localhost:${PORT}/api/test`);
    });
}

