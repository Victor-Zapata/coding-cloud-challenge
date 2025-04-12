// src/pages/__tests__/DetailOrder.test.jsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import DetailOrder from '../DetailOrder';
import api from '../../api';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../api');

describe('<DetailOrder />', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: '123' });
    api.get.mockResolvedValue({
      data: {
        id: '123',
        items: [
          { pizza: { name: 'Margherita', price: 5 }, quantity: 1 },
          { pizza: { name: 'Pepperoni', price: 7 }, quantity: 2 },
        ],
      },
    });
  });

  test('renderiza el estado de carga inicial', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    act(() => {
      render(<DetailOrder />);
    });
    expect(screen.getByText('Cargando orden...')).toBeInTheDocument();
  });

  test('renderiza los detalles de la orden correctamente cuando se cargan los datos', async () => {
    await act(async () => {
      render(<DetailOrder />);
      await waitFor(() => expect(screen.getByText('🍕 Orden #123')).toBeInTheDocument()); // Intenta con el string directamente
    });

    expect(screen.getByText((content) => content.startsWith('🍕 Orden #123'))).toBeInTheDocument();
    expect(screen.getByText('Detalles del Cliente')).toBeInTheDocument();
    expect(screen.getByText('Cliente: Invitado')).toBeInTheDocument();
    expect(screen.getByText('Artículos de la Orden')).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText((content) => content.startsWith('Total: $19.00'))).toBeInTheDocument();
    expect(screen.getByText('Tu orden está confirmada!')).toBeInTheDocument();
  });

  test('llama a la API con el ID correcto del parámetro', async () => {
    await act(async () => {
      render(<DetailOrder />);
      await waitFor(() => expect(api.get).toHaveBeenCalledWith('orders/123'));
    });
  });

  test('renderiza un mensaje si no hay items en la orden', async () => {
    api.get.mockResolvedValue({ data: { id: '456', items: [] } });
    await act(async () => {
      render(<DetailOrder />);
      await waitFor(() => expect(screen.getByText('🍕 Orden #456')).toBeInTheDocument()); 
    });
    expect(screen.getByText('Artículos de la Orden')).toBeInTheDocument();
  });
});