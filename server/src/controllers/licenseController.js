import jwt from 'jsonwebtoken';
import License from '../models/License.js';
import Patient from '../models/Patient.js';

// The secret key ONLY YOU know. Do not share this with clients!
const SECRET_KEY = process.env.LICENSE_SECRET || 'HARSH_PATHOLOGY_MASTER_KEY_2025';

// Default free trial limits if no license is installed
const DEFAULT_MAX_PATIENTS = 25; 

export const getLicenseStatus = async (req, res) => {
    try {
        const patientCount = await Patient.countDocuments();
        const licenseDoc = await License.findOne().sort({ installedAt: -1 });

        // If no license found, it's operating on the Free 25-Patient Trial
        if (!licenseDoc) {
            const isLocked = patientCount >= DEFAULT_MAX_PATIENTS;
            return res.json({
                status: isLocked ? 'locked' : 'active',
                message: isLocked ? 'Your trial period expired. Maximum 25 patients limit reached.' : `Trial Version (${patientCount}/25 Patients)`,
                limits: { maxPatients: DEFAULT_MAX_PATIENTS, validUntil: null },
                currentPatients: patientCount,
                type: 'TRIAL'
            });
        }

        // License is found, verify it mathematically using your secret key
        try {
            const decoded = jwt.verify(licenseDoc.activeKey, SECRET_KEY);
            
            let isLocked = false;
            let message = 'License Active';

            // Check Expiry Date (AMC Check)
            if (decoded.validUntil && new Date(decoded.validUntil) < new Date()) {
                isLocked = true;
                message = 'Your Annual Maintenance Charge (AMC) period has expired. Please clear dues to continue.';
            }

            // Check Patient Limit
            if (patientCount >= decoded.maxPatients) {
                isLocked = true;
                message = 'Patient registration limit reached for current license tier. Please upgrade.';
            }

            return res.status(200).json({
                status: isLocked ? 'locked' : 'active',
                message: message,
                limits: { maxPatients: decoded.maxPatients, validUntil: decoded.validUntil },
                currentPatients: patientCount,
                type: decoded.type
            });

        } catch (error) {
            return res.status(403).json({
                status: 'locked',
                message: 'SECURITY WARNING: License key is invalid or tampered with.',
                limits: { maxPatients: 0, validUntil: null },
                currentPatients: patientCount,
                type: 'TAMPERED'
            });
        }

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const activateLicense = async (req, res) => {
    try {
        const { key } = req.body;
        if (!key) return res.status(400).json({ success: false, message: 'Please provide an activation key.' });

        try {
            const decoded = jwt.verify(key, SECRET_KEY);
            
            await License.deleteMany({});
            await License.create({ activeKey: key });

            res.json({ success: true, message: `License Accepted! Welcome to the ${decoded.type} version.` });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Invalid Activation Key signature.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
