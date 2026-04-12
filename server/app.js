import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Import Express Routes
import wingRoutes from './src/routes/testWingRoutes.js';
import departmentRoutes from './src/routes/testDepartmentRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
import testUnitRoutes from './src/routes/testUnitRoutes.js';
import testRoutes from './src/routes/testRoutes.js';
import referenceDoctorRoutes from './src/routes/referenceDoctorRoutes.js';
import ageCategoryRoutes from './src/routes/ageCategoryRoutes.js';
import abnormalIndicationRoutes from './src/routes/abnormalIndicationRoutes.js';
import backupRoutes             from './src/routes/backupRoutes.js';
import licenseRoutes            from './src/routes/licenseRoutes.js';

// Basic Architecture Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'active', message: 'Pathology Lab Local Server is running flawlessly' });
});

// Configure API Routes
app.use('/api/wings', wingRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/test-units', testUnitRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/references', referenceDoctorRoutes);
app.use('/api/age-categories', ageCategoryRoutes);
app.use('/api/abnormal-indications', abnormalIndicationRoutes);
app.use('/api/backup',               backupRoutes);
app.use('/api/license',              licenseRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        details: err.errors || null
    });
});

export default app;
