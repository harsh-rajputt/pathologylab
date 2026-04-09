import TestDepartment from '../models/TestDepartment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createDepartment = asyncHandler(async (req, res) => {
    try {
        const newDept = new TestDepartment(req.body);
        await newDept.save();
        return res.status(201).json(new ApiResponse(201, { department: newDept }, "Department created successfully"));
    } catch (error) {
        throw new ApiError(400, "Failed to create department. Name might already exist or be invalid.", [error.message]);
    }
});

export const getDepartments = asyncHandler(async (req, res) => {
    const departments = await TestDepartment.find().sort({ orderNo: 1, createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, { departments }, "Departments fetched successfully"));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
    const dept = await TestDepartment.findByIdAndDelete(req.params.id);
    if (!dept) {
        throw new ApiError(404, "Department not found");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Department deleted successfully"));
});
