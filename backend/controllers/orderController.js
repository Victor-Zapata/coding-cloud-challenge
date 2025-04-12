
// me traigo las pizzas y las guardo en una variable
const pizzas = require('../data/example-pizzas.json');
const { validationResult } = require('express-validator');

//creo un array de ordenes
let orders = [];

let nextOrderId = 1;

const getAllOrders = (req, res) => {
  res.json(orders);
};

const getOrderById = (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
};

const createOrder = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { items } = req.body;
  console.log('🧾 Items recibidos en orden:', items);

  try {
    const orderItems = items.map(item => {
      const pizza = pizzas.find(p => p.name === item.pizzaId);
      if (!pizza) {
        throw new Error(`Pizza con nombre "${item.pizzaId}" no encontrada`);
      }
      return {
        pizza,
        quantity: item.quantity || 1,
      };
    });

    const order = {
      id: nextOrderId++,
      items: orderItems,
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    console.error('🔥 Error en createOrder:', error.message);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
};