import express from 'express'; //фреймворк
import ViteExpress from 'vite-express'; //связь с vite
import cors from 'cors'; //хз пока, не вникал
import path from 'path'; // нужна для разрешения использовать папку со статичными файлами фронту
import 'dotenv/config'; // очередной конфиг а вот че он делает...
import productsRoutes from './rootes/products/products.js';//Роут для товаров в приложении(Информация)
import authRoutes from './rootes/auth/login.js'; //Все три роута для авторизации 1
import registerRoutes from './rootes/auth/register.js'//2
import resetRoutes from './rootes/auth/reset.js'//3
const app = express(); //Приложение

app.use(cors()); 
app.use(express.json()); //

app.use('/api/products', productsRoutes); //доступ к продуктам по этому пути для фронта

import { fileURLToPath } from 'url';
import { dirname } from 'path';

//Так и не вник ,вроде просто костыль для работы со статичными файлами типо картинок
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Роут на папку с картинками товаров
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

//Роуты на авторизацию
app.use('/api/users', authRoutes);
app.use('/api/users', registerRoutes);
app.use('/api/users', resetRoutes);

//Просто тестовый роут чтобы знать что сервер не лёг
app.get('/api/test', (req, res) => {
    res.json ({messege: 'Сервер работает!'}); //тест с api просто чтобы видеть в терминале что сервер работает
})

//Порт сервера, либо прописанный в .env либо 4200 как стандартный
const PORT = process.env.PORT || 4200;

app.listen(PORT, () => { //Так же просто проверка сервера в терминале IDE 
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Проверить его можно здесь: http://localhost:${PORT}/api/test`);
});
