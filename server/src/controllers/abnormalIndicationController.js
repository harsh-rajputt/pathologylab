const AbnormalIndication = require('../models/AbnormalIndication');

exports.getAll = async (req, res) => {
    try {
        const items = await AbnormalIndication.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { low, high, isDefault, color } = req.body;
        
        if (isDefault) {
            await AbnormalIndication.updateMany({}, { isDefault: false });
        }
        
        const newItem = new AbnormalIndication({ low, high, isDefault, color });
        await newItem.save();
        res.status(201).json({ success: true, item: newItem });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { low, high, isDefault, color } = req.body;
        
        if (isDefault) {
            await AbnormalIndication.updateMany({ _id: { $ne: req.params.id } }, { isDefault: false });
        }
        
        const updated = await AbnormalIndication.findByIdAndUpdate(
            req.params.id, 
            { low, high, isDefault, color }, 
            { new: true }
        );
        res.status(200).json({ success: true, item: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await AbnormalIndication.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
