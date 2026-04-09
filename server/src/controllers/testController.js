import Test from '../models/Test.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createTest = asyncHandler(async (req, res) => {
    try {
        const test = new Test(req.body);
        await test.save();
        return res.status(201).json(new ApiResponse(201, { test }, "Test configuration created"));
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(400, "Test name already exists");
        }
        throw new ApiError(400, "Failed to create test configuration", [error.message]);
    }
});

export const getTests = asyncHandler(async (req, res) => {
    const tests = await Test.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, { tests }, "Tests fetched successfully"));
});

export const updateTest = asyncHandler(async (req, res) => {
    const item = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
        throw new ApiError(404, "Test not found");
    }
    return res.status(200).json(new ApiResponse(200, { test: item }, "Test updated successfully"));
});

export const getTestById = asyncHandler(async (req, res) => {
    const test = await Test.findById(req.params.id);
    if (!test) {
        throw new ApiError(404, "Test not found");
    }
    return res.status(200).json(new ApiResponse(200, { test }, "Test fetched successfully"));
});

export const deleteTest = asyncHandler(async (req, res) => {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
        throw new ApiError(404, "Test not found");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Test deleted successfully"));
});
