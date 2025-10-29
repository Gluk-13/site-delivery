import express from 'express';
import cors from 'cors'; 
import path from 'path'; 
import 'dotenv/config'; 

import productsRoutes from './routes/products/products.js';
import authRoutes from './routes/auth/login.js'; 
import cartRoutes from './routes/cart/cartRoutes.js'
import favorRoutes from './routes/favour/favorRoutes.js'
import orderRoutes from './routes/orders/orders.js'
import adminOrdersRoutes from './routes/orders/admin-orders.js'
import { authenticateToken } from './middleware/auth.js';
import { checkoutRole } from './middleware/role.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

//Routes
app.use('/api/products', productsRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', authRoutes);
app.use('/api/cart',authenticateToken, cartRoutes);
app.use('/api/favorites',authenticateToken, favorRoutes);
app.use('/api/orders',authenticateToken, orderRoutes);
app.use('/api/orders',authenticateToken, checkoutRole, adminOrdersRoutes);


app.get('/api/test', (req, res) => {
    res.json ({messege: 'Сервер работает!'});
})

export default app;

