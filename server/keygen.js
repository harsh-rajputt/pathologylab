import jwt from 'jsonwebtoken';

// MUST MATCH THE SECRET IN licenseController.js
const SECRET_KEY = process.env.LICENSE_SECRET || 'HARSH_PATHOLOGY_MASTER_KEY_2025';

function generateKey(type, maxPatients, validityDays) {
    let validUntil = null;

    // If validityDays is provided, calculate exact expiry date
    if (validityDays) {
        const date = new Date();
        date.setDate(date.getDate() + validityDays);
        validUntil = date.toISOString();
    }

    const payload = {
        type: type,
        maxPatients: maxPatients,
        validUntil: validUntil
    };

    const token = jwt.sign(payload, SECRET_KEY);

    console.log('\n=============================================');
    console.log(`🔑 EXPERT LICENSE GENERATOR`);
    console.log('=============================================');
    console.log(`Type:       ${type}`);
    console.log(`Limit:      ${maxPatients >= 999999 ? 'Unlimited' : maxPatients} Patients`);
    console.log(`Expires:    ${validUntil ? new Date(validUntil).toLocaleDateString() : 'Never'}`);
    console.log('---------------------------------------------');
    console.log('PRODUCT KEY (Copy everything below):\n');
    console.log(token);
    console.log('\n=============================================\n');
}

// -------------------------------------------------------------
// HOW TO USE: 
// Run this file: `node keygen.js`
// Comment out or modify the lines below to generate what you need!
// -------------------------------------------------------------

// Example 1: 1-Week Trial Extension (Unlimited patients for 7 days)
// generateKey('7-Day Extended Trial', 999999, 7);

// Example 2: 1-Year AMC Subscription (Unlimited patients, 365 Days)
generateKey('1-Year AMC', 999999, 365);

// Example 3: Permanent License capped at 1000 Patients
// generateKey('Basic 1000 Pack', 1000, null);

// Example 4: Full Premium (Unlimited Patients, Never Expires)
// generateKey('Premium Unlimited', 9999999, null);
