import React from 'react'; 
import { motion } from 'framer-motion';

function PizzaList({ pizzas, addPizza }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto p-6"
        >
            <h2 className="text-2xl font-bold mb-4 text-center">🍕 Menú</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pizzas.map(pizza => (
                    <motion.li
                        key={pizza.id}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white shadow-lg rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{pizza.name}</h3>
                                <p className="text-sm text-gray-500">${pizza.price}</p>
                            </div>
                            <button
                                onClick={() => addPizza(pizza)}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm"
                            >
                                Agregar
                            </button>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
}

export default PizzaList;
