// src/components/__tests__/PizzaList.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PizzaList from '../PizzaList';

describe('<PizzaList />', () => {
  const mockPizzas = [
    { id: 'margherita', name: 'Margherita', price: 5 },
    { id: 'pepperoni', name: 'Pepperoni', price: 7 },
  ];
  const mockAddPizza = jest.fn();

  beforeEach(() => {
    mockAddPizza.mockClear(); // Limpia el registro de llamadas del mock antes de cada prueba en este describe
  });

  test('renderiza la lista de pizzas correctamente', () => {
    render(<PizzaList pizzas={mockPizzas} addPizza={mockAddPizza} />);

    expect(screen.getByText('🍕 Menú')).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('$5')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('$7')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Agregar' }).length).toBe(mockPizzas.length);
  });

  test('llama a addPizza al hacer clic en el botón Agregar', () => {
    render(<PizzaList pizzas={mockPizzas} addPizza={mockAddPizza} />);
    const addButton = screen.getAllByRole('button', { name: 'Agregar' })[0]; // Selecciona el primer botón
    fireEvent.click(addButton);
    expect(mockAddPizza).toHaveBeenCalledTimes(1);
    expect(mockAddPizza).toHaveBeenCalledWith(mockPizzas[0]);
  });

  test('llama a addPizza con la pizza correcta al hacer clic en diferentes botones Agregar', () => {
    render(<PizzaList pizzas={mockPizzas} addPizza={mockAddPizza} />);
    const addButtons = screen.getAllByRole('button', { name: 'Agregar' });

    fireEvent.click(addButtons[0]);
    expect(mockAddPizza).toHaveBeenCalledWith(mockPizzas[0]);

    fireEvent.click(addButtons[1]);
    expect(mockAddPizza).toHaveBeenCalledWith(mockPizzas[1]);
    expect(mockAddPizza).toHaveBeenCalledTimes(2);
  });
});