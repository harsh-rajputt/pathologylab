import express from 'express';
const router = express.Router();
import { createWing, getWings, deleteWing  } from '../controllers/testWingController.js';

router.post('/', createWing);
router.get('/', getWings);
router.delete('/:id', deleteWing);

export default router;
