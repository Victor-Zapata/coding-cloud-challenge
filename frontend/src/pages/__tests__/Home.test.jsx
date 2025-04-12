// src/pages/__tests__/Home.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Home from '../Home';
import api from '../../api';
import { BrowserRouter, useNavigate } from 'react-router-dom';

// Mockea la librería api
jest.mock('../../api');

// Mockea el hook useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('<Home />', () => {
  const mockPizzas = [
    { name: 'Margherita', price: 5, id: 'Margherita' }, // Asegúrate de tener el ID
    { name: 'Pepperoni', price: 7, id: 'Pepperoni' },
  ];
  const mockNavigate = jest.fn();

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockPizzas });
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks(); // Limpia los mocks entre pruebas
  });

  test('renderiza el componente Home y carga las pizzas', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      await waitFor(() => screen.getByText('🍕 Menú'));
    });
    expect(screen.getByText('🍕 Pizza Order App')).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
  });

  test('agrega una pizza a la orden', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      await waitFor(() => screen.getByText('🍕 Menú'));
      const addButton = screen.getAllByRole('button', { name: 'Agregar' })[0];
      fireEvent.click(addButton);
    });
    expect(screen.getByText('Margherita x1')).toBeInTheDocument();
    expect(screen.getByText('Total: $5.00')).toBeInTheDocument();
  });

  test('incrementa la cantidad de una pizza en la orden', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      await waitFor(() => screen.getByText('🍕 Menú'));
      const addButtons = screen.getAllByRole('button', { name: 'Agregar' });
      fireEvent.click(addButtons[0]);
      fireEvent.click(addButtons[0]);
    });
    expect(screen.getByText('Margherita x2')).toBeInTheDocument();
    expect(screen.getByText('Total: $10.00')).toBeInTheDocument();
  });

  test('envía la orden y navega a la página de detalle', async () => {
    const mockResponse = { data: { id: 'order123' } };
    api.post.mockResolvedValue(mockResponse);

    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      await waitFor(() => screen.getByText('🍕 Menú'));
      const addButton = screen.getAllByRole('button', { name: 'Agregar' })[0];
      fireEvent.click(addButton);
      const submitButton = screen.getByRole('button', { name: 'Confirmar Orden' });
      fireEvent.click(submitButton);
      await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
      expect(api.post).toHaveBeenCalledWith('/orders', {
        items: [{ pizzaId: 'Margherita', quantity: 1 }],
      });
      expect(mockNavigate).toHaveBeenCalledWith(`/order/${mockResponse.data.id}`);
    });
  });

  test('muestra un mensaje de éxito después de enviar la orden', async () => {
    const mockResponse = { data: { id: 'order123' } };
    api.post.mockResolvedValue(mockResponse);

    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      await waitFor(() => screen.getByText('🍕 Menú'));
      const addButton = screen.getAllByRole('button', { name: 'Agregar' })[0];
      fireEvent.click(addButton);
      const submitButton = screen.getByRole('button', { name: 'Confirmar Orden' });
      fireEvent.click(submitButton);
      await waitFor(() => screen.getByText('✅ Orden confirmada: ID order123'));
    });
    expect(screen.getByText('✅ Orden confirmada: ID order123')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/order/order123');
  });

  test('muestra un mensaje de error si falla el envío de la orden', async () => {
    api.post.mockRejectedValue(new Error('Error en la orden'));

    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      await waitFor(() => screen.getByText('🍕 Menú'));
      const addButton = screen.getAllByRole('button', { name: 'Agregar' })[0];
      fireEvent.click(addButton);
      const submitButton = screen.getByRole('button', { name: 'Confirmar Orden' });
      fireEvent.click(submitButton);
      await waitFor(() => screen.getByText('❌ Error al enviar la orden.'));
    });
    expect(screen.getByText('❌ Error al enviar la orden.')).toBeInTheDocument();
  });
});