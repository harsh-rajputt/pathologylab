const AgeCategory = require('../models/AgeCategory');

exports.createAgeCategory = async (req, res) => {
    try {
        const { name, sex, ageStart, ageEnd, type } = req.body;

        const newCategory = await AgeCategory.create({
            name, sex, ageStart, ageEnd, type
        });

        res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAgeCategories = async (req, res) => {
    try {
        const categories = await AgeCategory.find().sort({ createdAt: 1 });
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateAgeCategory = async (req, res) => {
    try {
        const updatedCategory = await AgeCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        res.status(200).json({ success: true, category: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteAgeCategory = async (req, res) => {
    try {
        const category = await AgeCategory.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
