import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
    activeKey: {
        type: String,
        required: true
    },
    installedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('License', licenseSchema);
