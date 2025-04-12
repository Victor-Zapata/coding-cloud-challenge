// tests/pizza.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /api/pizzas', () => {
  it('debe devolver todas las pizzas', async () => {
    const res = await request(app).get('/api/pizzas');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
  });
});
