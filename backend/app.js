
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express!');
});

const pizzaRoutes = require('./routes/pizzaRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());

app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;

