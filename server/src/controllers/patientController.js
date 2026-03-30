const Patient = require('../models/Patient');

exports.registerPatient = async (req, res) => {
    try {
        let labId = req.body.id || ("LAB-" + Math.floor(10000 + Math.random() * 90000));
        
        const newPatient = new Patient({
            labId: labId,
            prefix: req.body.prefix,
            fullName: req.body.fullName,
            age: req.body.age,
            ageUnit: req.body.ageUnit,
            gender: req.body.gender,
            mobileNo: req.body.mobileNo,
            weight: req.body.weight,
            reportingDate: req.body.reportingDate,
            reportingTime: req.body.reportingTime,
            referBy: req.body.referBy,
            sampleType: req.body.sampleType,
            remarks: req.body.remarks,
            tests: req.body.tests,
            amounts: req.body.amounts,
            status: req.body.status || 'New'
        });

        await newPatient.save();
        res.status(201).json({ success: true, patient: newPatient });
    } catch (error) {
        console.error("Patient Registration Error:", error);
        res.status(400).json({ success: false, error: "Failed to register patient." });
    }
};

exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, patients });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch patients' });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Patient deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: "Failed to delete patient" });
    }
};
