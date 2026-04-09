import AbnormalIndication from '../models/AbnormalIndication.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAll = asyncHandler(async (req, res) => {
    const items = await AbnormalIndication.find().sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, { items }, "Abnormal indications fetched successfully"));
});

export const create = asyncHandler(async (req, res) => {
    const { low, high, isDefault, color } = req.body;

    if (isDefault) {
        await AbnormalIndication.updateMany({}, { isDefault: false });
    }

    const newItem = new AbnormalIndication({ low, high, isDefault, color });
    await newItem.save();
    return res
        .status(201)
        .json(new ApiResponse(201, { item: newItem }, "Abnormal indication created"));
});

export const update = asyncHandler(async (req, res) => {
    const { low, high, isDefault, color } = req.body;

    if (isDefault) {
        await AbnormalIndication.updateMany({ _id: { $ne: req.params.id } }, { isDefault: false });
    }

    const updated = await AbnormalIndication.findByIdAndUpdate(
        req.params.id,
        { low, high, isDefault, color },
        { new: true }
    );

    if (!updated) {
        throw new ApiError(404, "Abnormal indication not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { item: updated }, "Abnormal indication updated"));
});

export const remove = asyncHandler(async (req, res) => {
    const deleted = await AbnormalIndication.findByIdAndDelete(req.params.id);
    if (!deleted) {
        throw new ApiError(404, "Abnormal indication not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Deleted successfully"));
});
