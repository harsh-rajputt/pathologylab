import express from 'express';
const router = express.Router();
import { createUnit, getUnits, updateUnit, deleteUnit  } from '../controllers/testUnitController.js';

router.post('/', createUnit);
router.get('/', getUnits);
router.put('/:id', updateUnit);
router.delete('/:id', deleteUnit);

export default router;
