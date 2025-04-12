// src/components/__tests__/OrderSummary.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

describe('<OrderSummary />', () => {
  const mockItems = [
    { pizza: { name: 'Margherita', price: 5 }, quantity: 1 },
    { pizza: { name: 'Pepperoni', price: 7 }, quantity: 2 },
  ];
  const mockOnSubmit = jest.fn();

  test('renderiza el resumen de la orden con items', () => {
    render(<OrderSummary items={mockItems} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('🧾 Tu Orden')).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('$14.00')).toBeInTheDocument();
    // Usar una función como matcher para el texto del total
    expect(screen.getByText((content) => content.startsWith('Total: $19.00'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar Orden' })).toBeEnabled();
  });

  test('renderiza el resumen de la orden vacío', () => {
    render(<OrderSummary items={[]} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('🧾 Tu Orden')).toBeInTheDocument();
    expect(screen.getByText('Tu orden está vacía.')).toBeInTheDocument();
    // Usar una función como matcher para el texto del total
    expect(screen.getByText((content) => content.startsWith('Total: $0.00'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar Orden' })).toBeDisabled();
  });

  test('llama a onSubmit al hacer clic en Confirmar Orden', () => {
    render(<OrderSummary items={mockItems} onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByRole('button', { name: 'Confirmar Orden' });
    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(mockItems); // Asegúrate de pasar los items si tu componente lo espera
  });
});