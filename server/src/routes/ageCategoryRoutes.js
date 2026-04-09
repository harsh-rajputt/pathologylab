import express from 'express';
const router = express.Router();
import { createAgeCategory, 
    getAgeCategories, 
    updateAgeCategory, 
    deleteAgeCategory 
 } from '../controllers/ageCategoryController.js';

router.post('/', createAgeCategory);
router.get('/', getAgeCategories);
router.put('/:id', updateAgeCategory);
router.delete('/:id', deleteAgeCategory);

export default router;
