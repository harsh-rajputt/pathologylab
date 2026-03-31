const TestUnit = require('../models/TestUnit');

exports.createUnit = async (req, res) => {
    try {
        const item = new TestUnit(req.body);
        await item.save();
        res.status(201).json({ success: true, unit: item });
    } catch (error) {
        if(error.code === 11000) return res.status(400).json({ success: false, error: "Unit already exists" });
        res.status(400).json({ success: false, error: "Failed to create unit" });
    }
};

exports.getUnits = async (req, res) => {
    try {
        const units = await TestUnit.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, units });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch units" });
    }
};

exports.updateUnit = async (req, res) => {
    try {
        const item = await TestUnit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, unit: item });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to update unit" });
    }
};

exports.deleteUnit = async (req, res) => {
    try {
        await TestUnit.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to delete" });
    }
};
