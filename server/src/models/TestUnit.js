const mongoose = require('mongoose');

const testUnitSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('TestUnit', testUnitSchema);
