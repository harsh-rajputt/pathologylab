const ReferenceDoctor = require('../models/ReferenceDoctor');

exports.createReference = async (req, res) => {
    try {
        const reference = new ReferenceDoctor(req.body);
        await reference.save();
        res.status(201).json({ success: true, reference });
    } catch (error) {
        console.error("Error saving reference:", error);
        res.status(400).json({ success: false, error: 'Failed to create reference' });
    }
};

exports.getReferences = async (req, res) => {
    try {
        const references = await ReferenceDoctor.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, references });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch references' });
    }
};

exports.deleteReference = async (req, res) => {
    try {
        await ReferenceDoctor.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Reference deleted properly' });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to delete reference' });
    }
};
