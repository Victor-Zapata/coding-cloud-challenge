import { motion } from 'framer-motion';

const OrderSummary = ({ order, onSubmit }) => {
  const total = order.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 mt-8 bg-white rounded-lg shadow-md border border-gray-200" // Más compacto y con mejor sombra
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">🧾 Tu Orden</h2> {/* Título más claro */}
      {order.length === 0 ? (
        <p className="text-gray-600 italic">Tu orden está vacía.</p>
      ) : (
        <ul className="space-y-3"> {/* Más espacio entre los items */}
          {order.map(item => (
            <li key={item.id} className="flex justify-between items-center text-gray-700"> {/* Alineación vertical */}
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">x{item.quantity}</span>
                <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span> {/* Precio por item */}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 py-2 border-t border-gray-200"> {/* Separador visual */}
        <p className="text-lg font-semibold text-gray-800">Total: <span className="text-green-600">${total.toFixed(2)}</span></p> {/* Resaltar el total */}
      </div>
      <button
        onClick={onSubmit}
        className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" // Mejor feedback visual
        disabled={order.length === 0} // Deshabilitar si la orden está vacía
      >
        Confirmar Orden
      </button>
    </motion.div>
  );
}

export default OrderSummary;