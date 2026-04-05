const express = require('express');
const router = express.Router();
const { 
    createAgeCategory, 
    getAgeCategories, 
    updateAgeCategory, 
    deleteAgeCategory 
} = require('../controllers/ageCategoryController');

router.post('/', createAgeCategory);
router.get('/', getAgeCategories);
router.put('/:id', updateAgeCategory);
router.delete('/:id', deleteAgeCategory);

module.exports = router;
