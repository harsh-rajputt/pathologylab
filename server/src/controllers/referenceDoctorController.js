import ReferenceDoctor from '../models/ReferenceDoctor.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createReference = asyncHandler(async (req, res) => {
    const reference = new ReferenceDoctor(req.body);
    await reference.save();
    return res.status(201).json(new ApiResponse(201, { reference }, "Reference created successfully"));
});

export const getReferences = asyncHandler(async (req, res) => {
    const references = await ReferenceDoctor.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, { references }, "References fetched successfully"));
});

export const deleteReference = asyncHandler(async (req, res) => {
    const reference = await ReferenceDoctor.findByIdAndDelete(req.params.id);
    if (!reference) {
        throw new ApiError(404, "Reference not found");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Reference deleted properly"));
});
