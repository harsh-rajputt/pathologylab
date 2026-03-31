const express = require('express');
const router = express.Router();
const { createUnit, getUnits, updateUnit, deleteUnit } = require('../controllers/testUnitController');

router.post('/', createUnit);
router.get('/', getUnits);
router.put('/:id', updateUnit);
router.delete('/:id', deleteUnit);

module.exports = router;
