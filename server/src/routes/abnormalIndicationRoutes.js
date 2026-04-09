import express from 'express';
const router = express.Router();
import * as controller from '../controllers/abnormalIndicationController.js';

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
