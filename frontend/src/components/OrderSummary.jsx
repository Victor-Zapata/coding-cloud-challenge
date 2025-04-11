

const OrderSummary = ({ order, onSubmit }) => {
  const total = order.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Order Summary</h2>
      <ul>
        {order.map(item => (
          <li key={item.id}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>
      <p><strong>Total:</strong> ${total}</p>
      <button onClick={onSubmit}>Confirm Order</button>
    </div>
  );
}

export default OrderSummary;
