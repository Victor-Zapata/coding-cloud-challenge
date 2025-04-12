import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

describe('<OrderSummary />', () => {
  const mockOrderItems = [
    { id: '1', name: 'Pizza Margherita', price: 10, quantity: 1 },
    { id: '2', name: 'Pizza Pepperoni', price: 12, quantity: 2 },
  ];
  const mockOnSubmit = jest.fn();

  test('renderiza el componente con la orden y calcula el total correctamente', () => {
    render(<OrderSummary order={mockOrderItems} onSubmit={mockOnSubmit} />);

    // Verifica el título
    expect(screen.getByText('🧾 Tu Orden')).toBeInTheDocument();

    // Verifica los items de la orden
    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();

    expect(screen.getByText('Pizza Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('$24.00')).toBeInTheDocument();

    // Verifica el total
    expect(screen.getByText((content) => content && content.startsWith('Total: $34.00'))).toBeInTheDocument();
    expect(screen.getByText((content) => content && content.startsWith('Total: $0.00'))).toBeInTheDocument();

    // Verifica el botón de confirmar
    expect(screen.getByRole('button', { name: 'Confirmar Orden' })).toBeEnabled();
  });

  test('renderiza el componente con una orden vacía', () => {
    render(<OrderSummary order={[]} onSubmit={mockOnSubmit} />);

    // Verifica el título
    expect(screen.getByText('🧾 Tu Orden')).toBeInTheDocument();

    // Verifica el mensaje de orden vacía
    expect(screen.getByText('Tu orden está vacía.')).toBeInTheDocument();

    // Verifica el total en cero
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument();

    // Verifica que el botón de confirmar esté deshabilitado
    expect(screen.getByRole('button', { name: 'Confirmar Orden' })).toBeDisabled();
  });

  test('llama a la función onSubmit cuando se hace clic en el botón Confirmar Orden', () => {
    render(<OrderSummary order={mockOrderItems} onSubmit={mockOnSubmit} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirmar Orden' });
    fireEvent.click(confirmButton);

    // Verifica que la función onSubmit haya sido llamada
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    // Verifica que la función onSubmit haya sido llamada con la orden correcta
    expect(mockOnSubmit).toHaveBeenCalledWith(mockOrderItems);
  });
});