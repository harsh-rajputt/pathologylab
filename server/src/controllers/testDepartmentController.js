const TestDepartment = require('../models/TestDepartment');

exports.createDepartment = async (req, res) => {
    try {
        const newDept = new TestDepartment(req.body);
        await newDept.save();
        res.status(201).json({ success: true, department: newDept });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to create department. Name might already exist or be invalid." });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const departments = await TestDepartment.find().sort({ orderNo: 1, createdAt: -1 });
        res.status(200).json({ success: true, departments });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch departments from database' });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        await TestDepartment.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to delete department" });
    }
};
