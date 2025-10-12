import express from 'express'; //фреймворк
import cors from 'cors'; //хз пока, не вникал
import path from 'path'; // нужна для разрешения использовать папку со статичными файлами фронту
import 'dotenv/config'; // очередной конфиг а вот че он делает...

import productsRoutes from './routes/products/products.js';//Роут для товаров в приложении(Информация)
import authRoutes from './routes/auth/login.js'; 
import cartRoutes from './routes/cart/cartRoutes.js'
import favorRoutes from './routes/favour/favorRoutes.js'
import orderRoutes from './routes/orders/orders.js'

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
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favorRoutes);
app.use('/api/orders', orderRoutes)

//Просто тестовый роут чтобы знать что сервер не лёг
app.get('/api/test', (req, res) => {
    res.json ({messege: 'Сервер работает!'}); //тест с api просто чтобы видеть в терминале что сервер работает
})

export default app;

