import Patient             from '../models/Patient.js';
import Test                from '../models/Test.js';
import TestDepartment      from '../models/TestDepartment.js';
import TestWing            from '../models/TestWing.js';
import TestUnit            from '../models/TestUnit.js';
import ReferenceDoctor     from '../models/ReferenceDoctor.js';
import AgeCategory         from '../models/AgeCategory.js';
import AbnormalIndication  from '../models/AbnormalIndication.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * All collections we back up, in dependency order
 * (master-data first so foreign keys resolve on restore).
 */
const COLLECTIONS = [
    { key: 'wings',               Model: TestWing           },
    { key: 'departments',         Model: TestDepartment     },
    { key: 'units',               Model: TestUnit           },
    { key: 'ageCategories',       Model: AgeCategory        },
    { key: 'abnormalIndications', Model: AbnormalIndication },
    { key: 'references',          Model: ReferenceDoctor    },
    { key: 'tests',               Model: Test               },
    { key: 'patients',            Model: Patient            },
];

// ─── GET /api/backup ──────────────────────────────────────────────────────────
/**
 * Streams a complete JSON backup of every collection.
 * The client receives a .json file download.
 */
export const createBackup = async (req, res) => {
    try {
        const backup = {
            version:    '1.0',
            createdAt:  new Date().toISOString(),
            software:   'PathologyLab Management System',
            collections: {}
        };

        for (const { key, Model } of COLLECTIONS) {
            backup.collections[key] = await Model.find({}).lean();
        }

        const filename = `pathlab-backup-${new Date().toISOString().slice(0, 10)}.json`;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).json(backup);

    } catch (err) {
        console.error('[Backup] createBackup error:', err);
        res.status(500).json({ success: false, error: 'Backup generation failed.' });
    }
};

// ─── GET /api/backup/info ─────────────────────────────────────────────────────
/**
 * Returns live document counts for each collection so the UI can display
 * a "Current Database Stats" card without downloading the full backup.
 */
export const getBackupInfo = async (req, res) => {
    try {
        const counts = {};
        for (const { key, Model } of COLLECTIONS) {
            counts[key] = await Model.countDocuments();
        }

        const latest = new Date().toISOString();
        res.status(200).json({ success: true, counts, fetchedAt: latest });

    } catch (err) {
        console.error('[Backup] getBackupInfo error:', err);
        res.status(500).json({ success: false, error: 'Could not fetch database info.' });
    }
};

// ─── POST /api/backup/restore ─────────────────────────────────────────────────
/**
 * Accepts a JSON backup body, validates the structure,
 * then wipes + reinserts each collection.
 *
 * Body: the raw backup JSON (application/json).
 *
 * Strategy: "replace-all" — existing data is overwritten.
 * Each collection is cleared first, then populated from backup.
 * Uses mongoose _id preservation so all ObjectId references stay intact.
 */
export const restoreBackup = async (req, res) => {
    try {
        const backup = req.body;

        // ── Validate structure ──────────────────────────────────────────────
        if (!backup || !backup.collections || backup.version !== '1.0') {
            return res.status(400).json({
                success: false,
                error: 'Invalid backup file. Make sure you upload a file exported from this software.'
            });
        }

        const summary = {};

        for (const { key, Model } of COLLECTIONS) {
            const docs = backup.collections[key];
            if (!Array.isArray(docs)) continue;   // skip missing collections gracefully

            // Wipe existing collection, then bulk-insert backup documents
            await Model.deleteMany({});

            if (docs.length > 0) {
                // insertMany with ordered:false continues even if a doc fails
                await Model.insertMany(docs, { ordered: false });
            }

            summary[key] = docs.length;
        }

        res.status(200).json({
            success: true,
            message: 'Database restored successfully. All previous data has been replaced.',
            summary
        });

    } catch (err) {
        console.error('[Backup] restoreBackup error:', err);
        res.status(500).json({
            success: false,
            error: `Restore failed: ${err.message}`
        });
    }
};

// ─── POST /api/backup/verify-passcode ──────────────────────────────────────────
export const verifyPasscode = async (req, res) => {
    try {
        const { passcode } = req.body;
        const correctPasscode = process.env.SUPPORT_PASSCODE || 'Pathology@Support';
        
        if (passcode === correctPasscode) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false, error: 'Incorrect passcode' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Verification error' });
    }
};
