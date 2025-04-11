import { useEffect, useState } from 'react';
import api from './api';
import PizzaList from './components/PizzaList';
import OrderSummary from './components/OrderSummary';

function App() {
  const [pizzas, setPizzas] = useState([]);
  const [order, setOrder] = useState([]);
  const [message, setMessage] = useState('');

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

  const submitOrder = () => {
    const items = order.map(item => ({
      pizzaId: item.id,
      quantity: item.quantity,
    }));

    api.post('/orders', { items })
      .then(res => {
        setMessage(`✅ Your order is confirmed. Order summary: ${JSON.stringify(res.data)}`);
        setOrder([]);
      })
      .catch(() => setMessage("❌ Error placing order."));
  };

  return (
    <div>
      <h1>Pizza Order App</h1>
      <PizzaList pizzas={pizzas} addPizza={addPizza} />
      <OrderSummary order={order} onSubmit={submitOrder} />
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;

