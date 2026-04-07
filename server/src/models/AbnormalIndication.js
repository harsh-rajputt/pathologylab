const mongoose = require('mongoose');

const abnormalIndicationSchema = new mongoose.Schema({
    low: { type: String, required: true },
    high: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    color: { type: String, default: '#DC2626' }
}, { timestamps: true });

module.exports = mongoose.model('AbnormalIndication', abnormalIndicationSchema);
