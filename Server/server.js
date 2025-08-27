const express = require('express');
const ViteExpress = require('vite-express');
const cors = require('cors');
require('dotevn').config();

const app = express();

app.use(cors());
app.use(express.json());

const productsRoutes = require('./rootes/products');
app.use('/api/products', productsRoutes);


app.get('/api/test', (req, res) => {
    res.json ({messege: 'Сервер работает!'});
})

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Проверить его можно здесь: http://localhost:${PORT}/api/test`);
});

