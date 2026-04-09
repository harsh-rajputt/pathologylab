import express from 'express';
const router = express.Router();
import { createReference, getReferences, deleteReference  } from '../controllers/referenceDoctorController.js';

router.post('/', createReference);
router.get('/', getReferences);
router.delete('/:id', deleteReference);

export default router;
