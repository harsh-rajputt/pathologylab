const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    testName: { type: String, required: true, unique: true },
    wing: String,
    department: String,
    unit: String,
    testFormat: String,
    nr1: String,
    nr2: String,
    nr3: String,
    nr4: String,
    nr5: String,
    setDefault: Boolean,
    normalLower: String,
    normalHigher: String,
    defaultResult: String,
    method: String,
    sample: String,
    vial: String,
    reportingDays: String,
    rate: Number,
    discount: Number,
    offerRate: Number,
    content: String,
    showMethod: Boolean,
    showComment: Boolean,
    testNameBold: Boolean,
    useCommentResult: Boolean,
    resultBold: Boolean,
    paragraphResult: Boolean,
    pageBreak: Boolean,
    showShortCode: Boolean,
    testId: String,
    testCode: String,
    shortCode: String,
    ageGroups: [{
        id: Number,
        category: String,
        normalRange: String,
        lower: String,
        higher: String
    }],
    childTests: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.Test || mongoose.model('Test', testSchema);
