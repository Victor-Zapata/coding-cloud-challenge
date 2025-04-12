import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PizzaList from '../PizzaList';

describe('<PizzaList />', () => {
  const mockPizzas = [
    { id: '1', name: 'Pizza Margherita', price: 10 },
    { id: '2', name: 'Pizza Pepperoni', price: 12 },
  ];
  const mockAddPizza = jest.fn();

  test('renderiza el componente y muestra el menú de pizzas', () => {
    render(<PizzaList pizzas={mockPizzas} addPizza={mockAddPizza} />);
    // ... otras aserciones ...
    const addButtons = screen.getAllByRole('button', { name: 'Agregar' });
    expect(addButtons).toHaveLength(mockPizzas.length);
    expect(addButtons[0]).toBeInTheDocument();
    expect(addButtons[1]).toBeInTheDocument();
  });

  test('llama a la función addPizza con la pizza correcta al hacer clic en "Agregar"', () => {
    render(<PizzaList pizzas={mockPizzas} addPizza={mockAddPizza} />);
    const addButtonMargherita = screen.getByRole('button', { name: 'Agregar', within: screen.getByText('Pizza Margherita').closest('li') });
    const addButtonPepperoni = screen.getByRole('button', { name: 'Agregar', within: screen.getByText('Pizza Pepperoni').closest('li') });
    // ... simulación de clics ...
  });

  test('renderiza una lista vacía de pizzas correctamente', () => {
    render(<PizzaList pizzas={[]} addPizza={mockAddPizza} />);

    // Verifica el título del menú
    expect(screen.getByText('🍕 Menú')).toBeInTheDocument();

    // Verifica que no se rendericen elementos de la lista de pizzas
    const pizzaItems = screen.queryAllByRole('listitem');
    expect(pizzaItems).toHaveLength(0);

    // Verifica que no haya botones "Agregar"
    const addButtons = screen.queryAllByRole('button', { name: 'Agregar' });
    expect(addButtons).toHaveLength(0);
  });
});