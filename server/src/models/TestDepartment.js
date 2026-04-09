import mongoose from 'mongoose';

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


// We check if the model exists before compiling it to prevent overwrite errors during hot-reloads
export default mongoose.models.TestDepartment || mongoose.model('TestDepartment', testDepartmentSchema);
