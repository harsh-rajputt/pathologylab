const mongoose = require('mongoose');

const ageCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Age category name is required'],
        trim: true
    },
    sex: {
        type: String,
        required: [true, 'Sex (Under) assignment is required'],
        trim: true
    },
    ageStart: {
        type: String,
        default: "0"
    },
    ageEnd: {
        type: String,
        default: "0"
    },
    type: {
        type: String,
        default: "D/M/Y"
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.AgeCategory || mongoose.model('AgeCategory', ageCategorySchema);
