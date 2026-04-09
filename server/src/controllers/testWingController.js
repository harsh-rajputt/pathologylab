import TestWing from '../models/TestWing.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createWing = asyncHandler(async (req, res) => {
    try {
        const newWing = new TestWing({ name: req.body.name });
        await newWing.save(); // This literally saves the object into MongoDB!
        return res
            .status(201)
            .json(new ApiResponse(201, { wing: newWing }, "Wing created successfully"));
    } catch (error) {
        throw new ApiError(400, "Failed to create wing. Name might already exist or be invalid.", [error.message]);
    }
});

export const getWings = asyncHandler(async (req, res) => {
    const wings = await TestWing.find().sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, { wings }, "Wings fetched successfully"));
});

export const deleteWing = asyncHandler(async (req, res) => {
    const wing = await TestWing.findByIdAndDelete(req.params.id);
    if (!wing) {
        throw new ApiError(404, "Wing not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Wing deleted successfully"));
});
