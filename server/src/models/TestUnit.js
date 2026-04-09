import mongoose from 'mongoose';

const testUnitSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });


// We check if the model exists before compiling it to prevent overwrite errors during hot-reloads
export default mongoose.models.TestUnit || mongoose.model('TestUnit', testUnitSchema);
