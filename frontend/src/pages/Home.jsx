import { useEffect, useMemo, useState } from "react";
import api from "../api";
import OrderSummary from "../components/OrderSummary";
import PizzaList from "../components/PizzaList";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const [rawPizzas, setRawPizzas] = useState([]);
    const [order, setOrder] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/pizzas').then(res => setRawPizzas(res.data));
    }, []);

    // Asignar el nombre como ID a cada pizza
    const pizzas = useMemo(() => {
        return rawPizzas.map(pizza => ({
            ...pizza,
            id: pizza.name, // Usamos el nombre como ID
        }));
    }, [rawPizzas]);

    const addPizza = (pizza) => {
        console.log('Agregando pizza:', pizza);
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
            pizzaId: item.id, // será el nombre de la pizza
            quantity: item.quantity,
        }));

        api.post('/orders', { items })
            .then(res => {
                setMessage(`✅ Orden confirmada: ID ${res.data.id}`);
                setOrder([]);
                navigate(`/order/${res.data.id}`)
                setTimeout(() => {
                    navigate('/')
                }, 3000);
            })
            .catch(() => setMessage("❌ Error al enviar la orden."));
    };

    return (

        <div className="min-h-screen bg-gray-50 py-8">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">🍕 Pizza Order App</h1>
            <PizzaList pizzas={pizzas} addPizza={addPizza} />
            <OrderSummary order={order} onSubmit={submitOrder} />
            {message && <p className="text-center mt-4 text-green-600 font-medium">{message}</p>}
        </div>
    )
}

export default Home