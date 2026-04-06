const request = require('supertest');
const app = require('../app');
const Patient = require('../src/models/Patient');

// Mock Patient model
jest.mock('../src/models/Patient');

describe('Patient Registration & Management API', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('POST /api/patients - Should register a new patient successfully', async () => {
        const mockPatientData = {
            fullName: 'Test Patient',
            age: 30,
            gender: 'Male',
            amounts: { totalAmount: 1000, received: 500, dues: 500 }
        };

        // Create returning saved object
        const mockSavedPatient = { _id: 'patient_id', ...mockPatientData, labId: 'LAB-12345' };
        
        // Mock save logic for new Patient() instance
        const saveMock = jest.fn().mockResolvedValue(mockSavedPatient);
        Patient.mockImplementation(() => ({
            save: saveMock,
            ...mockSavedPatient
        }));

        const response = await request(app).post('/api/patients').send(mockPatientData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.patient.fullName).toBe('Test Patient');
    });

    it('GET /api/patients - Should return patients list', async () => {
        const mockList = [{ fullName: 'P1' }, { fullName: 'P2' }];
        
        const mockQuery = {
            sort: jest.fn().mockResolvedValue(mockList)
        };
        Patient.find.mockReturnValue(mockQuery);

        const response = await request(app).get('/api/patients');

        expect(response.status).toBe(200);
        expect(response.body.patients).toHaveLength(2);
    });

    it('PUT /api/patients/:id - Should update patient and return fresh record', async () => {
        const mockUpdate = { fullName: 'Updated Name', amounts: { dues: 0 } };
        Patient.findByIdAndUpdate.mockResolvedValue({ _id: 'p_id', ...mockUpdate });

        const response = await request(app).put('/api/patients/p_id').send(mockUpdate);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.patient.fullName).toBe('Updated Name');
    });

    it('DELETE /api/patients/:id - Should successfully delete patient', async () => {
        Patient.findByIdAndDelete.mockResolvedValue({ _id: 'p_id' });

        const response = await request(app).delete('/api/patients/p_id');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});
