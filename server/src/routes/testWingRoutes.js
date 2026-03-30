const express = require('express');
const router = express.Router();
const { createWing, getWings, deleteWing } = require('../controllers/testWingController');

router.post('/', createWing);
router.get('/', getWings);
router.delete('/:id', deleteWing);

module.exports = router;
