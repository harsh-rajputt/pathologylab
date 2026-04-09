import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

// Database Connection
// Defaults to a local MongoDB instance designed for the local client software installation
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pathologylab';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to Local MongoDB Database'))
  .catch(err => console.error('❌ MongoDB Connection Error. Is MongoDB installed and running?', err));

// Start the Backend Node Server
app.listen(PORT, () => {
    console.log(`🚀 System Server active locally at http://localhost:${PORT}`);
});
