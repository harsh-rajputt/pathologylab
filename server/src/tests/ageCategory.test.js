import request from 'supertest';
import app from '../app.js';
import AgeCategory from '../src/models/AgeCategory.js';

// Mock the Mongoose model
jest.mock('../src/models/AgeCategory');

describe('Age Category CRUD API', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('POST /api/age-categories - Creation should succeed with valid data', async () => {
        const mockData = { name: 'Toddler', sex: 'Male', ageStart: '1', ageEnd: '4', type: 'Y' };
        AgeCategory.create.mockResolvedValue({ _id: 'mock_id', ...mockData });

        const response = await request(app).post('/api/age-categories').send(mockData);
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.category.name).toBe('Toddler');
        expect(AgeCategory.create).toHaveBeenCalledWith(mockData);
    });

    it('GET /api/age-categories - Should list all categories', async () => {
        const mockList = [{ name: 'Infant', sex: 'Male' }, { name: 'Child', sex: 'Female' }];
        // Model.find().sort() chaining mock
        const mockQuery = {
            sort: jest.fn().mockResolvedValue(mockList)
        };
        AgeCategory.find.mockReturnValue(mockQuery);

        const response = await request(app).get('/api/age-categories');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.categories).toHaveLength(2);
        expect(AgeCategory.find).toHaveBeenCalled();
    });

    it('PUT /api/age-categories/:id - Should update existing record', async () => {
        const mockUpdate = { name: 'Youngster' };
        AgeCategory.findByIdAndUpdate.mockResolvedValue({ _id: 'mock_id', name: 'Youngster' });

        const response = await request(app).put('/api/age-categories/mock_id').send(mockUpdate);

        expect(response.status).toBe(200);
        expect(response.body.category.name).toBe('Youngster');
    });

    it('DELETE /api/age-categories/:id - Should remove record', async () => {
        AgeCategory.findByIdAndDelete.mockResolvedValue({ _id: 'mock_id' });

        const response = await request(app).delete('/api/age-categories/mock_id');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Category deleted');
    });
});
