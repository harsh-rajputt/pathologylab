import express from 'express';
const router = express.Router();
import { registerPatient, getPatients, deletePatient, updatePatient  } from '../controllers/patientController.js';

router.post('/', registerPatient);
router.get('/', getPatients);
router.delete('/:id', deletePatient);
router.put('/:id', updatePatient);

export default router;
