const pizzas = require('../data/example-pizzas.json');

const getAllPizzas = (req, res) => {
  res.json(pizzas);
};

module.exports = {
  getAllPizzas,
};
