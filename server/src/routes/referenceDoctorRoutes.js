const express = require('express');
const router = express.Router();
const { createReference, getReferences, deleteReference } = require('../controllers/referenceDoctorController');

router.post('/', createReference);
router.get('/', getReferences);
router.delete('/:id', deleteReference);

module.exports = router;
