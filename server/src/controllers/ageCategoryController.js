import AgeCategory from '../models/AgeCategory.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createAgeCategory = asyncHandler(async (req, res) => {
    const { name, sex, ageStart, ageEnd, type } = req.body;

    const newCategory = await AgeCategory.create({
        name, sex, ageStart, ageEnd, type
    });

    return res
        .status(201)
        .json(new ApiResponse(201, { category: newCategory }, "Category created successfully"));
});

export const getAgeCategories = asyncHandler(async (req, res) => {
    const categories = await AgeCategory.find().sort({ createdAt: 1 });
    return res
        .status(200)
        .json(new ApiResponse(200, { categories }, "Categories fetched successfully"));
});

export const updateAgeCategory = asyncHandler(async (req, res) => {
    const updatedCategory = await AgeCategory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedCategory) {
        throw new ApiError(404, 'Category not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { category: updatedCategory }, "Category updated successfully"));
});

export const deleteAgeCategory = asyncHandler(async (req, res) => {
    const category = await AgeCategory.findByIdAndDelete(req.params.id);
    if (!category) {
        throw new ApiError(404, 'Category not found');
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Category deleted'));
});
