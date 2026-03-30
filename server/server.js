const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Defaults to a local MongoDB instance designed for the local client software installation
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pathologylab';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to Local MongoDB Database'))
  .catch(err => console.error('❌ MongoDB Connection Error. Is MongoDB installed and running?', err));

// Import Express Routes
const wingRoutes = require('./src/routes/testWingRoutes');
const departmentRoutes = require('./src/routes/testDepartmentRoutes');
const patientRoutes = require('./src/routes/patientRoutes');

// Basic Architecture Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'active', message: 'Pathology Lab Local Server is running flawlessly' });
});

// Configure API Routes
app.use('/api/wings', wingRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/patients', patientRoutes);

// Start the Backend Node Server
app.listen(PORT, () => {
    console.log(`🚀 System Server active locally at http://localhost:${PORT}`);
});
