const pizzas = require('../data/example-pizzas.json');

let orders = [
    {
      id: 1,
      items: [
        {
          pizza: pizzas[0],
          quantity: 2,
        },
      ],
    },
  ];
   
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
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must have items' });
  }

  const orderItems = items.map(item => {
    const pizza = pizzas.find(p => p.id === item.pizzaId);
    if (!pizza) {
      throw new Error(`Pizza with ID ${item.pizzaId} not found`);
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
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
};
