const mongoose = require('mongoose');

const testDepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        unique: true,
        trim: true
    },
    orderNo: {
        type: Number,
        default: 0
    },
    wing: {
        type: String,
        default: "-"
    },
    comment: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.TestDepartment || mongoose.model('TestDepartment', testDepartmentSchema);
