import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import DetailOrder from '../DetailOrder';
import api from '../../api';
 

// Mock del hook useParams de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Importa las funcionalidades reales que no mockeas
  useParams: jest.fn(),
}));

jest.mock('../../api', () => ({ 
  get: jest.fn(),
}));

describe('<DetailOrder />', () => {
  beforeEach(() => {
    // Limpia las llamadas al mock de api.get antes de cada prueba
    api.get.mockClear();
    // Configura el valor de retorno por defecto para useParams
    useParams.mockReturnValue({ id: '123' });
  });

  test('renderiza el estado de carga inicial', () => {
    // Configura el mock de api.get para que no resuelva inmediatamente
    api.get.mockReturnValue(new Promise(() => {}));

    render(<DetailOrder />);

    // Verifica que el texto de carga se muestre
    expect(screen.getByText('Cargando orden...')).toBeInTheDocument();
  });

  test('renderiza los detalles de la orden correctamente cuando se cargan los datos', async () => {
    // Configura los datos de la orden que la API devolverá
    const mockOrderData = {
      id: '123',
      items: [
        { pizza: { name: 'Margherita', price: 10 }, quantity: 1 },
        { pizza: { name: 'Pepperoni', price: 12 }, quantity: 2 },
      ],
    };
    api.get.mockResolvedValue({ data: mockOrderData });

    render(<DetailOrder />);

    // Espera a que los datos se carguen y el componente se re-renderice
    await waitFor(() => {
      expect(screen.getByText('🍕 Orden #123')).toBeInTheDocument();
    });

    // Verifica los detalles de la orden
    expect(screen.getByText('🍕 Orden #123')).toBeInTheDocument();
    expect(screen.getByText('Detalles del Cliente')).toBeInTheDocument();
    expect(screen.getByText('Cliente: Invitado')).toBeInTheDocument();
    expect(screen.getByText('Artículos de la Orden')).toBeInTheDocument();
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('Total: $34.00')).toBeInTheDocument();
    expect(screen.getByText('Tu orden está confirmada!')).toBeInTheDocument();

    // Verifica que la API fue llamada con la URL correcta
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith('orders/123');
  });

  test('renderiza un mensaje si la orden no tiene items', async () => {
    // Configura los datos de la orden sin items
    const mockOrderData = {
      id: '456',
      items: [],
    };
    api.get.mockResolvedValue({ data: mockOrderData });
    useParams.mockReturnValue({ id: '456' });

    render(<DetailOrder />);

    await waitFor(() => {
      expect(screen.getByText('🍕 Orden #456')).toBeInTheDocument();
    });

    expect(screen.getByText('🍕 Orden #456')).toBeInTheDocument();
    expect(screen.getByText('Artículos de la Orden')).toBeInTheDocument();
    expect(screen.queryByText(/Margherita/i)).toBeNull(); // Verifica que no se muestren items
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument();
  });

  test('maneja el caso en que la API devuelve un error', async () => {
    const mockErrorMessage = 'Error al cargar la orden';
    api.get.mockRejectedValue(new Error(mockErrorMessage));

    // Mockea un componente de error para simular el manejo de errores
    const mockErrorComponent = () => <div>{mockErrorMessage}</div>;
    jest.spyOn(React, 'useState').mockReturnValueOnce([undefined, jest.fn()]).mockReturnValueOnce([mockErrorMessage, jest.fn()]);

    render(<DetailOrder />);

    await waitFor(() => {
      expect(screen.getByText(mockErrorMessage)).toBeInTheDocument();
    });

    // Limpia el mock para no afectar otras pruebas
    React.useState.mockRestore();
  });
});