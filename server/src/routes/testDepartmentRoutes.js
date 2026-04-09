import express from 'express';
const router = express.Router();
import { createDepartment, getDepartments, deleteDepartment  } from '../controllers/testDepartmentController.js';

router.post('/', createDepartment);
router.get('/', getDepartments);
router.delete('/:id', deleteDepartment);

export default router;
