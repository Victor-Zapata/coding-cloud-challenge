// src/components/__tests__/OrderSummary.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

describe('<OrderSummary />', () => {
  const mockOrderItems = [ // Cambié el nombre para mayor claridad
    { pizza: { name: 'Margherita', price: 5 }, quantity: 1 },
    { pizza: { name: 'Pepperoni', price: 7 }, quantity: 2 },
  ];
  const mockOnSubmit = jest.fn();

  test('renderiza el resumen de la orden con items', () => {
    render(<OrderSummary order={mockOrderItems} onSubmit={mockOnSubmit} />); // Usa 'order' aquí

    expect(screen.getByText('🧾 Tu Orden')).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText((content) => content.startsWith('Total: $19.00'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar Orden' })).toBeEnabled();
  });

  test('renderiza el resumen de la orden vacío', () => {
    render(<OrderSummary order={[]} onSubmit={mockOnSubmit} />); // Pasa un array vacío a 'order'

    expect(screen.getByText('🧾 Tu Orden')).toBeInTheDocument();
    expect(screen.getByText('Tu orden está vacía.')).toBeInTheDocument();
    expect(screen.getByText((content) => content.startsWith('Total: $0.00'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar Orden' })).toBeDisabled();
  });

  test('llama a onSubmit al hacer clic en Confirmar Orden', () => {
    render(<OrderSummary order={mockOrderItems} onSubmit={mockOnSubmit} />); // Usa 'order' aquí
    const submitButton = screen.getByRole('button', { name: 'Confirmar Orden' });
    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(mockOrderItems); // Pasa los items de la orden
  });
});