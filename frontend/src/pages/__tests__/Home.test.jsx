import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '../Home';
import api from '../../api';
import { BrowserRouter, useNavigate } from 'react-router-dom';

// Mock del módulo api
jest.mock('../../api', () => ({ 
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock del hook useNavigate de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('<Home />', () => {
  let mockNavigate;

  beforeEach(() => {
    // Limpia los mocks antes de cada prueba
    api.get.mockClear();
    api.post.mockClear();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  const mockPizzasData = [
    { name: 'Margherita', price: 10 },
    { name: 'Pepperoni', price: 12 },
  ];

  test('renderiza el componente Home y carga las pizzas', async () => {
    api.get.mockResolvedValue({ data: mockPizzasData });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Espera a que las pizzas se carguen y se rendericen
    await waitFor(() => {
      expect(screen.getByText('🍕 Menú')).toBeInTheDocument();
    });

    // Verifica el título de la aplicación
    expect(screen.getByText('🍕 Pizza Order App')).toBeInTheDocument();

    // Verifica que las pizzas se rendericen en la lista
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('$12')).toBeInTheDocument();

    // Verifica que la API fue llamada correctamente
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith('/pizzas');
  });

  test('agrega una pizza a la orden', async () => {
    api.get.mockResolvedValue({ data: mockPizzasData });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('🍕 Menú'));

    // Encuentra el botón "Agregar" para la primera pizza (Margherita)
    const addButton = screen.getByRole('button', { name: 'Agregar', within: screen.getByText('Margherita').closest('li') });
    fireEvent.click(addButton);

    // Verifica que la pizza se haya agregado al resumen de la orden
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  test('incrementa la cantidad de una pizza en la orden', async () => {
    api.get.mockResolvedValue({ data: mockPizzasData });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('🍕 Menú'));

    // Agrega la pizza dos veces
    const addButton = screen.getByRole('button', { name: 'Agregar', within: screen.getByText('Margherita').closest('li') });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // Verifica que la cantidad se haya incrementado
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  test('envía la orden y navega a la página de detalle', async () => {
    api.get.mockResolvedValue({ data: mockPizzasData });
    const mockOrderResponse = { data: { id: 'order123' } };
    api.post.mockResolvedValue(mockOrderResponse);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('🍕 Menú'));

    // Agrega una pizza a la orden
    const addButton = screen.getByRole('button', { name: 'Agregar', within: screen.getByText('Margherita').closest('li') });
    fireEvent.click(addButton);

    // Encuentra y hace clic en el botón "Confirmar Orden"
    const submitButton = screen.getByRole('button', { name: 'Confirmar Orden' });
    fireEvent.click(submitButton);

    // Espera a que la API de envío de la orden sea llamada
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith('/orders', {
        items: [{ pizzaId: 'Margherita', quantity: 1 }],
      });
    });

    // Verifica que el mensaje de éxito se muestre
    await waitFor(() => {
      expect(screen.getByText('✅ Orden confirmada: ID order123')).toBeInTheDocument();
    });

    // Verifica que la navegación a la página de detalle se haya realizado
    expect(mockNavigate).toHaveBeenCalledWith('/order/order123');

    // Espera el tiempo del setTimeout y verifica la navegación de vuelta a '/'
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 3500 }); // Ajusta el timeout ligeramente mayor que el setTimeout
  });

  test('muestra un mensaje de error si falla el envío de la orden', async () => {
    api.get.mockResolvedValue({ data: mockPizzasData });
    api.post.mockRejectedValue(new Error('Error en la orden'));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('🍕 Menú'));

    // Agrega una pizza a la orden
    const addButton = screen.getByRole('button', { name: 'Agregar', within: screen.getByText('Margherita').closest('li') });
    fireEvent.click(addButton);

    // Encuentra y hace clic en el botón "Confirmar Orden"
    const submitButton = screen.getByRole('button', { name: 'Confirmar Orden' });
    fireEvent.click(submitButton);

    // Espera a que la API de envío de la orden sea llamada
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    // Verifica que el mensaje de error se muestre
    await waitFor(() => {
      expect(screen.getByText('❌ Error al enviar la orden.')).toBeInTheDocument();
    });

    // Verifica que la navegación no haya ocurrido inmediatamente
    expect(mockNavigate).not.toHaveBeenCalledWith('/order/order123');
  });
});