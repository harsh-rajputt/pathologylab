const Test = require('../models/Test');

exports.createTest = async (req, res) => {
    try {
        const test = new Test(req.body);
        await test.save();
        res.status(201).json({ success: true, test });
    } catch (error) {
        if(error.code === 11000) return res.status(400).json({ success: false, error: "Test name already exists" });
        console.error("Create Test Error:", error);
        res.status(400).json({ success: false, error: "Failed to create test configuration" });
    }
};

exports.getTests = async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, tests });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch tests" });
    }
};
exports.updateTest = async (req, res) => {
    try {
        const item = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, test: item });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to update test" });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        await Test.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to delete test" });
    }
};
