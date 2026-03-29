const mongoose = require('mongoose');

const testWingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Wing name is required'],
        unique: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt dates!
});

// We check if the model exists before compiling it to prevent overwrite errors during hot-reloads
module.exports = mongoose.models.TestWing || mongoose.model('TestWing', testWingSchema);
