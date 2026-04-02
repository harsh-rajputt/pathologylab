const express = require('express');
const router = express.Router();
const { createTest, getTests, updateTest, deleteTest, getTestById } = require('../controllers/testController');

router.post('/', createTest);
router.get('/', getTests);
router.get('/:id', getTestById);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

module.exports = router;
