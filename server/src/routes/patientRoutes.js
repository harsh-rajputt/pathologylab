const express = require('express');
const router = express.Router();
const { registerPatient, getPatients, deletePatient } = require('../controllers/patientController');

router.post('/', registerPatient);
router.get('/', getPatients);
router.delete('/:id', deletePatient);

module.exports = router;
