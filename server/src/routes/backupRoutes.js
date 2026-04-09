import express from 'express';
import {
    createBackup,
    restoreBackup,
    getBackupInfo,
    verifyPasscode
} from '../controllers/backupController.js';

const router = express.Router();

// GET  /api/backup          → Download full backup JSON
// POST /api/backup/restore  → Upload & restore backup JSON
// GET  /api/backup/info     → Metadata: collection counts for preview

router.get('/',         createBackup);
router.post('/restore', restoreBackup);
router.get('/info',     getBackupInfo);
router.post('/verify-passcode', verifyPasscode);

export default router;
