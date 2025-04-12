const request = require('supertest');
const app = require('../../src/app'); // Importa tu aplicación Express

describe('POST /orders', () => {
  it('should return 201 and the created order for a valid request', async () => {
    const orderData = {
      items: [
        { pizzaId: 'Margherita', quantity: 2 },
        { pizzaId: 'Pepperoni' },
      ],
    };

    const response = await request(app)
      .post('/orders')
      .send(orderData)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].pizza.name).toBe('Margherita');
    expect(response.body.items[0].quantity).toBe(2);
    expect(response.body.items[1].pizza.name).toBe('Pepperoni');
    expect(response.body.items[1].quantity).toBe(1);
  });

  it('should return 400 for a request without items', async () => {
    const response = await request(app)
      .post('/orders')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(response.body.errors.some(error => error.msg === 'La orden debe contener al menos un item.')).toBe(true);
  });

  // ... Escribe más casos de prueba para los otros escenarios de validación ...
});