const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Express Routes
const wingRoutes = require('./src/routes/testWingRoutes');
const departmentRoutes = require('./src/routes/testDepartmentRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const testUnitRoutes = require('./src/routes/testUnitRoutes');
const testRoutes = require('./src/routes/testRoutes');
const referenceDoctorRoutes = require('./src/routes/referenceDoctorRoutes');
const ageCategoryRoutes = require('./src/routes/ageCategoryRoutes');

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

module.exports = app;
