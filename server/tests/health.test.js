const request = require('supertest');
const app = require('../app');

describe('Health Check API', () => {
    it('should return 200 OK and valid status', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'active');
    });
});
