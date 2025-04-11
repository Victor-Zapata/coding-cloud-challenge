import React, { useEffect, useState } from 'react';
import api from './api';
import PizzaList from './components/PizzaList';

const App = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    api.get('/pizzas').then(res => setPizzas(res.data));
  }, []);

  const addPizza = (pizza) => {
    setOrder(prev => {
      const exists = prev.find(item => item.id === pizza.id);
      if (exists) {
        return prev.map(item =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
  };



  return (
    <div>
      <h1>Pizza Order App</h1>
      <PizzaList pizzas={pizzas} addPizza={addPizza} />

    </div>
  );
}

export default App;

