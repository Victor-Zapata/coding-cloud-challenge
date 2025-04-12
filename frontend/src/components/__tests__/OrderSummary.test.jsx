import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

describe('OrderSummary component', () => {
  it('muestra mensaje de orden vacía', () => {
    render(<OrderSummary order={[]} onSubmit={jest.fn()} />);
    expect(screen.getByText('Tu orden está vacía.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar orden/i })).toBeDisabled();
  });

  it('muestra los ítems del pedido y el total', () => {
    const mockOrder = [
      { id: 'pepperoni', name: 'Pepperoni', price: 10, quantity: 2 },
      { id: 'margarita', name: 'Margarita', price: 8, quantity: 1 },
    ];
    render(<OrderSummary order={mockOrder} onSubmit={jest.fn()} />);

    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument(); // 10 * 2

    expect(screen.getByText('Margarita')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText('$8.00')).toBeInTheDocument();

    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('$28.00')).toBeInTheDocument(); // 20 + 8

    expect(screen.getByRole('button', { name: /confirmar orden/i })).toBeEnabled();
  });

  it('llama a onSubmit cuando se hace clic en el botón', () => {
    const mockSubmit = jest.fn();
    const mockOrder = [{ id: 'pepperoni', name: 'Pepperoni', price: 10, quantity: 1 }];
    render(<OrderSummary order={mockOrder} onSubmit={mockSubmit} />);
    const button = screen.getByRole('button', { name: /confirmar orden/i });

    fireEvent.click(button);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
