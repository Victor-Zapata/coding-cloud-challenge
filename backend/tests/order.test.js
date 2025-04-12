// tests/order.test.js
const request = require('supertest');
const app = require('../app');

describe('POST /api/orders', () => {
  it('debe crear una orden correctamente', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [
          { pizzaId: "Margherita", quantity: 2 },
          { pizzaId: "Diavola", quantity: 1 }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.items.length).toBe(2);
  });

  it('debe fallar si no se mandan items', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: [] });

    expect(res.statusCode).toBe(400);
  });
});
