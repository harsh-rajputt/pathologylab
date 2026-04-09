import mongoose from 'mongoose';

const referenceDoctorSchema = new mongoose.Schema({
    refByName: { type: String, required: true },
    typeOf: { type: String, required: true },
    centerName: { type: String },
    hospital: { type: String },
    pathology: { type: String },
    radiology: { type: String },
    address: { type: String },
    email: { type: String },
    contactNumber: { type: String },
    profession: { type: String },
    state: { type: String },
    city: { type: String }
}, {
    timestamps: true
});


// We check if the model exists before compiling it to prevent overwrite errors during hot-reloads
export default mongoose.models.ReferenceDoctor || mongoose.model('ReferenceDoctor', referenceDoctorSchema);
