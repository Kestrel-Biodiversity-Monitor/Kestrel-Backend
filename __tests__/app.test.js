const request = require('supertest');
const app = require('../app');

describe('App Core Routes', () => {
  it('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('env');
  });

  it('GET /api/nonexistent-route returns 404', async () => {
    const res = await request(app).get('/api/fake-endpoint-1234');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});
