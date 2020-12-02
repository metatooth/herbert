const request = require('supertest');
const app = require('../index');

describe('Get Status', () => {
  it('should get a status code 200', async () => {
    const res = await request(app)
        .get('/ifttt/v1/status')
        .send({});
    expect(res.statusCode).toEqual(200);
  });
});
