// src/pages/__tests__/DetailOrder.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DetailOrder from "../DetailOrder";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "../../api";

// Mock de la API
jest.mock("../../api");

const mockOrder = {
  id: "abc123",
  items: [
    {
      quantity: 2,
      pizza: {
        name: "Pepperoni",
        price: 12.5,
      },
    },
    {
      quantity: 1,
      pizza: {
        name: "Margarita",
        price: 9.0,
      },
    },
  ],
};

describe("DetailOrder", () => {
  beforeEach(() => {
    // Simula la respuesta de la API
    api.get.mockResolvedValue({ data: mockOrder });
  });

  test("muestra un mensaje de carga al inicio", () => {
    render(
      <MemoryRouter initialEntries={["/orders/abc123"]}>
        <Routes>
          <Route path="/orders/:id" element={<DetailOrder />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/cargando orden/i)).toBeInTheDocument();
  });

  test("renderiza los datos de la orden después de cargar", async () => {
    render(
      <MemoryRouter initialEntries={["/orders/abc123"]}>
        <Routes>
          <Route path="/orders/:id" element={<DetailOrder />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/orden #abc123/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Pepperoni")).toBeInTheDocument();
    expect(screen.getByText("Margarita")).toBeInTheDocument();
    expect(screen.getByText("x2")).toBeInTheDocument();
    expect(screen.getByText("x1")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument(); // Pepperoni x2
    expect(screen.getByText("$9.00")).toBeInTheDocument(); // Margarita x1
    expect(screen.getByText(/total/i)).toBeInTheDocument();
    expect(screen.getByText("$34.00")).toBeInTheDocument();
  });
});
