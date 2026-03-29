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

// Import Mongoose Models
const TestWing = require('./models/TestWing');

// Basic Architecture Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'active', message: 'Pathology Lab Local Server is running flawlessly' });
});

// ==== TEST WING API ROUTES ==== //
// 1. Create a new Wing (Save to MongoDB)
app.post('/api/wings', async (req, res) => {
    try {
        const newWing = new TestWing({ name: req.body.name });
        await newWing.save(); // This literally saves the object into MongoDB!
        res.status(201).json({ success: true, wing: newWing });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to create wing. Name might already exist or be invalid." });
    }
});

// 2. Fetch all Wings (Read from MongoDB)
app.get('/api/wings', async (req, res) => {
    try {
        // Find all documents in the TestWings collection, sort by descending creation time
        const wings = await TestWing.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, wings });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch wings from database' });
    }
});

// 3. Delete a Wing (Remove from MongoDB)
app.delete('/api/wings/:id', async (req, res) => {
    try {
        await TestWing.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Wing deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to delete wing" });
    }
});

// Start the Backend Node Server
app.listen(PORT, () => {
    console.log(`🚀 System Server active locally at http://localhost:${PORT}`);
});
