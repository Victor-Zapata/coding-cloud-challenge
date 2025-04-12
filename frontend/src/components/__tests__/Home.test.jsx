import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../src/pages/Home'; // Subimos un nivel y luego entramos a src/pages
import api from '../src/api'; // Importa la instancia de axios
import { BrowserRouter } from 'react-router-dom'; // Necesario para useNavigate
import '@testing-library/jest-dom';

// Mock de la función get de la API
jest.mock('../src/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [
    { name: 'Margherita', price: 5 },
    { name: 'Pepperoni', price: 7 },
  ]})),
  post: jest.fn(() => Promise.resolve({ data: { id: 'mockOrderId' } })),
}));

describe('Home', () => {
  test('renderiza el componente Home y carga las pizzas', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Espera a que se carguen las pizzas
    await waitFor(() => screen.getByText('🍕 Menú'));
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
  });

  test('agrega una pizza a la orden', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('🍕 Menú'));
    const addButton = screen.getByRole('button', { name: 'Agregar' });
    fireEvent.click(addButton);
    expect(screen.getByText('Margherita x1')).toBeInTheDocument();
  });

  test('envía la orden y navega a la página de detalle', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('🍕 Menú'));
    const addButton = screen.getAllByRole('button', { name: 'Agregar' });
    fireEvent.click(addButton);
    const submitButton = screen.getByText('Confirmar Orden');
    fireEvent.click(submitButton);

    expect(api.post).toHaveBeenCalledWith('/orders', {
      items: [{ pizzaId: 'Margherita', quantity: 1 }],
    });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/order/mockOrderId'));

    // Limpiar el mock de useNavigate después de la prueba
    jest.unmock('react-router-dom');
  });
});