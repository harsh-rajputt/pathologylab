const express = require('express');
const router = express.Router();
const { registerPatient, getPatients, deletePatient, updatePatient } = require('../controllers/patientController');

router.post('/', registerPatient);
router.get('/', getPatients);
router.delete('/:id', deletePatient);
router.put('/:id', updatePatient);

module.exports = router;
