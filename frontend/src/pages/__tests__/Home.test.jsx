import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../Home';
import { MemoryRouter } from 'react-router-dom';
import api from '../../api';

// Mock de api.js
jest.mock('../../api');

const mockPizzas = [
  { name: 'Pepperoni', price: 12.99, ingredients: ['pepperoni', 'cheese'] },
  { name: 'Margarita', price: 9.99, ingredients: ['tomato', 'mozzarella'] },
];

const mockOrderResponse = {
  data: {
    id: 'order123',
    items: [],
    total: 22.98,
  }
};

describe('Home component', () => {
  beforeEach(() => {
    api.get.mockResolvedValueOnce({ data: mockPizzas });
  });

  it('renderiza las pizzas y permite hacer una orden', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Aparece loading y luego pizzas
    await waitFor(() => {
      expect(screen.getByText('Pepperoni')).toBeInTheDocument();
      expect(screen.getByText('Margarita')).toBeInTheDocument();
    });

    // Agrega pizza al pedido
    fireEvent.click(screen.getByText(/Agregar/i, { selector: 'button' }));

    // Verifica que la pizza está en el resumen
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText(/\$12.99/)).toBeInTheDocument();

    // Mock del POST al enviar la orden
    api.post.mockResolvedValueOnce(mockOrderResponse);

    // Enviar orden
    fireEvent.click(screen.getByText(/Confirmar Orden/i));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('api/orders', {
        items: [{ pizzaId: 'Pepperoni', quantity: 1 }],
      })
    );

    // Mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/✅ Orden confirmada: ID order123/)).toBeInTheDocument();
    });
  });
});
