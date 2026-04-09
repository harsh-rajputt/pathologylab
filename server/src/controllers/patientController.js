import Patient from '../models/Patient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const registerPatient = asyncHandler(async (req, res) => {
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
    return res.status(201).json(new ApiResponse(201, { patient: newPatient }, "Patient registered successfully"));
});

export const getPatients = asyncHandler(async (req, res) => {
    const { from, upto } = req.query;
    let query = {};
    
    if (from && upto) {
        query.createdAt = {
            $gte: new Date(from),
            $lte: new Date(new Date(upto).setHours(23, 59, 59, 999))
        };
    }
    
    const patients = await Patient.find(query).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, { patients }, "Patients fetched successfully"));
});

export const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Patient deleted successfully"));
});

export const updatePatient = asyncHandler(async (req, res) => {
    const updatedPatient = await Patient.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
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
                status: req.body.status,
                results: req.body.results
            }
        },
        { new: true, runValidators: true }
    );

    if (!updatedPatient) {
        throw new ApiError(404, "Patient not found.");
    }

    return res.status(200).json(new ApiResponse(200, { patient: updatedPatient }, "Patient updated successfully"));
});
