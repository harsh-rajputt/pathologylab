import TestUnit from '../models/TestUnit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createUnit = asyncHandler(async (req, res) => {
    try {
        const item = new TestUnit(req.body);
        await item.save();
        return res.status(201).json(new ApiResponse(201, { unit: item }, "Unit created successfully"));
    } catch (error) {
        if(error.code === 11000) {
            throw new ApiError(400, "Unit already exists");
        }
        throw new ApiError(400, "Failed to create unit", [error.message]);
    }
});

export const getUnits = asyncHandler(async (req, res) => {
    const units = await TestUnit.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, { units }, "Units fetched successfully"));
});

export const updateUnit = asyncHandler(async (req, res) => {
    const item = await TestUnit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
        throw new ApiError(404, "Unit not found");
    }
    return res.status(200).json(new ApiResponse(200, { unit: item }, "Unit updated successfully"));
});

export const deleteUnit = asyncHandler(async (req, res) => {
    const unit = await TestUnit.findByIdAndDelete(req.params.id);
    if (!unit) {
        throw new ApiError(404, "Unit not found");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Unit deleted successfully"));
});
