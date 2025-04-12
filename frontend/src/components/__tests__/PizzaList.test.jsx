import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PizzaList from '../PizzaList';

describe('PizzaList component', () => {
  const pizzas = [
    { id: 'pepperoni', name: 'Pepperoni', price: 12.99 },
    { id: 'margarita', name: 'Margarita', price: 9.99 },
  ];

  const mockAddPizza = jest.fn();

  beforeEach(() => {
    render(<PizzaList pizzas={pizzas} addPizza={mockAddPizza} />);
  });

  it('muestra el menú con las pizzas', () => {
    expect(screen.getByText('🍕 Menú')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Margarita')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('llama a addPizza cuando se hace clic en "Agregar"', () => {
    const buttons = screen.getAllByText('Agregar');
    expect(buttons.length).toBe(2);

    fireEvent.click(buttons[0]); // Agrega Pepperoni
    expect(mockAddPizza).toHaveBeenCalledWith(pizzas[0]);

    fireEvent.click(buttons[1]); // Agrega Margarita
    expect(mockAddPizza).toHaveBeenCalledWith(pizzas[1]);
  });
});
