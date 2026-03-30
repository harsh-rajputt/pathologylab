const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: String,
    price: Number
}, { _id: false });

const amountSchema = new mongoose.Schema({
    discount: Number,
    discountType: String,
    discountBy: String,
    payMode: String,
    received: Number,
    transactionId: String,
    totalAmount: Number,
    payableAmount: Number,
    dues: Number
}, { _id: false });

const patientSchema = new mongoose.Schema({
    labId: { type: String, required: true, unique: true },
    prefix: String,
    fullName: { type: String, required: true },
    age: Number,
    ageUnit: String,
    gender: String,
    mobileNo: String,
    weight: Number,
    reportingDate: String,
    reportingTime: String,
    referBy: String,
    sampleType: String,
    remarks: String,
    tests: [testSchema],
    amounts: amountSchema,
    status: { type: String, default: 'New' }
}, { timestamps: true });

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
