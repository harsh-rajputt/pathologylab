import express from 'express';
const router = express.Router();
import { createTest, getTests, updateTest, deleteTest, getTestById  } from '../controllers/testController.js';

router.post('/', createTest);
router.get('/', getTests);
router.get('/:id', getTestById);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

export default router;
