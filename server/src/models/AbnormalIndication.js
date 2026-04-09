import mongoose from 'mongoose';

const abnormalIndicationSchema = new mongoose.Schema({
    low: { type: String, required: true },
    high: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    color: { type: String, default: '#DC2626' }
}, { timestamps: true });


// We check if the model exists before compiling it to prevent overwrite errors during hot-reloads
export default mongoose.models.AbnormalIndication || mongoose.model('AbnormalIndication', abnormalIndicationSchema);
