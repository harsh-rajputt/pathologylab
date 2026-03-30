const TestWing = require('../models/TestWing');

exports.createWing = async (req, res) => {
    try {
        const newWing = new TestWing({ name: req.body.name });
        await newWing.save(); // This literally saves the object into MongoDB!
        res.status(201).json({ success: true, wing: newWing });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to create wing. Name might already exist or be invalid." });
    }
};

exports.getWings = async (req, res) => {
    try {
        // Find all documents in the TestWings collection, sort by descending creation time
        const wings = await TestWing.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, wings });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch wings from database' });
    }
};

exports.deleteWing = async (req, res) => {
    try {
        await TestWing.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Wing deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to delete wing" });
    }
};
