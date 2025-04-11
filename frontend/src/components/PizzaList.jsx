
const PizzaList = ({ pizzas, addPizza }) => {
    return (
        <div>
            <h2>Menu</h2>
            <ul>
                {pizzas.map(pizza => (
                    <li key={pizza.id}>
                        <strong>{pizza.name}</strong> - ${pizza.price}
                        <button onClick={() => addPizza(pizza)}>Add</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PizzaList


