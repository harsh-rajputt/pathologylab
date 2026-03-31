const express = require('express');
const router = express.Router();
const { createTest, getTests, updateTest, deleteTest } = require('../controllers/testController');

router.post('/', createTest);
router.get('/', getTests);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

module.exports = router;
