import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const DetailOrder = () => {
    const [order, setOrder] = useState(undefined);
    const params = useParams();

    useEffect(() => {
        api.get(`/api/orders/${params.id}`).then(res => setOrder(res.data));
    }, [params.id]);

    if (!order) {
        return <div className="text-center py-8">Cargando orden...</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">🍕 Orden #{order.id}</h2>
            <div className="mb-4 border-b border-gray-200 pb-2">
                <h3 className="text-lg font-semibold text-gray-700">Detalles del Cliente</h3>
                {/* Aquí podrías mostrar información del cliente si tu API la proporciona */}
                <p className="text-gray-600 text-sm">Cliente: Invitado</p> {/* Ejemplo */}
                {/* <p className="text-gray-600 text-sm">Fecha: {new Date().toLocaleDateString()}</p> */} {/* Ejemplo de fecha */}
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Artículos de la Orden</h3>
                <ul className="space-y-3">
                    {order.items && order.items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center text-gray-700">
                            <span className="font-medium">{item.pizza.name}</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">x{item.quantity}</span>
                                <span className="text-sm font-semibold">${(item.pizza.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="py-2 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-800 text-right">
                    Total: <span className="text-green-600">${order.items && order.items.reduce((acc, item) => acc + item.pizza.price * item.quantity, 0).toFixed(2)}</span>
                </p>
            </div>

            <div className="mt-6 text-center text-gray-500 text-sm">
                Tu orden está confirmada!
            </div>
        </div>
    );
};

export default DetailOrder;