"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomer = exports.createCustomer = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_1 = __importDefault(require("../firebase"));
const uuid_1 = require("uuid");
const db = firebase_1.default.firestore();
const storage = firebase_1.default.storage();
// Helper function to set CORS headers
const setCorsHeaders = (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.set('Access-Control-Max-Age', '3600');
};
// Handle CORS preflight
const handleCors = (req, res) => {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return true;
    }
    return false;
};
exports.createCustomer = functions.https.onRequest(async (req, res) => {
    if (handleCors(req, res))
        return;
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    try {
        // Get form data
        const { email, phone_number, first_name, last_name, dateOfBirth, ipAddress, taxId, address, identityDocument, telegramId } = req.body;
        // Validate required fields
        if (!email || !phone_number || !first_name || !last_name || !dateOfBirth || !ipAddress || !address || !identityDocument || !telegramId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Validate address fields
        const { addressLine1, city, stateProvinceRegion, country, postalCode } = JSON.parse(address);
        if (!addressLine1 || !city || !stateProvinceRegion || !country || !postalCode) {
            res.status(400).json({ error: 'Missing required address fields' });
            return;
        }
        // Validate identity document fields
        const { idDocCountry, idDocType, idDocNumber } = JSON.parse(identityDocument);
        if (!idDocCountry || !idDocType || !idDocNumber) {
            res.status(400).json({ error: 'Missing required identity document fields' });
            return;
        }
        // Check if files are present
        const files = req.files;
        if (!files || !files.idDocFrontFile || !files.idDocBackFile) {
            res.status(400).json({ error: 'Missing required document files' });
            return;
        }
        // Generate a unique ID for the customer
        const customerId = (0, uuid_1.v4)();
        // Upload files to Firebase Storage
        const frontFile = files.idDocFrontFile;
        const backFile = files.idDocBackFile;
        const frontStorageRef = storage.bucket().file(`identity_docs/${customerId}/front_${Date.now()}`);
        const backStorageRef = storage.bucket().file(`identity_docs/${customerId}/back_${Date.now()}`);
        await Promise.all([
            frontStorageRef.save(frontFile.buffer, {
                metadata: {
                    contentType: frontFile.mimetype,
                },
            }),
            backStorageRef.save(backFile.buffer, {
                metadata: {
                    contentType: backFile.mimetype,
                },
            }),
        ]);
        // Get download URLs
        const [frontUrl, backUrl] = await Promise.all([
            frontStorageRef.getSignedUrl({
                action: 'read',
                expires: '03-01-2500', // Long expiration for document verification
            }),
            backStorageRef.getSignedUrl({
                action: 'read',
                expires: '03-01-2500',
            }),
        ]);
        // Create customer data object
        const customerData = {
            email,
            phone_number,
            first_name,
            last_name,
            dateOfBirth,
            ipAddress,
            taxId: taxId || '',
            address: {
                addressLine1,
                addressLine2: JSON.parse(address).addressLine2 || '',
                city,
                stateProvinceRegion,
                country,
                postalCode,
            },
            identityDocument: {
                idDocCountry,
                idDocType,
                idDocNumber,
                idDocFrontUrl: frontUrl[0],
                idDocBackUrl: backUrl[0],
            },
            telegramId: String(telegramId),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'pending',
        };
        // Save to Firestore
        await db.collection('customers').doc(customerId).set(customerData);
        // Return success response
        res.status(200).json({
            id: customerId,
            ...customerData,
        });
    }
    catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({
            error: error.message || 'Failed to create customer'
        });
    }
});
// Add updateCustomer endpoint
exports.updateCustomer = functions.https.onRequest(async (req, res) => {
    if (handleCors(req, res))
        return;
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    try {
        const customerId = req.query.customerId;
        if (!customerId) {
            res.status(400).json({ error: 'Customer ID is required' });
            return;
        }
        // Get form data
        const { email, phone_number, first_name, last_name, dateOfBirth, ipAddress, taxId, address, identityDocument, } = req.body;
        // Validate required fields
        if (!email || !phone_number || !first_name || !last_name || !dateOfBirth || !ipAddress || !address || !identityDocument) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Validate address fields
        const { addressLine1, city, stateProvinceRegion, country, postalCode } = JSON.parse(address);
        if (!addressLine1 || !city || !stateProvinceRegion || !country || !postalCode) {
            res.status(400).json({ error: 'Missing required address fields' });
            return;
        }
        // Validate identity document fields
        const { idDocCountry, idDocType, idDocNumber } = JSON.parse(identityDocument);
        if (!idDocCountry || !idDocType || !idDocNumber) {
            res.status(400).json({ error: 'Missing required identity document fields' });
            return;
        }
        // Get existing customer
        const customerDoc = await db.collection('customers').doc(customerId).get();
        if (!customerDoc.exists) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }
        const existingCustomer = customerDoc.data();
        let frontUrl = existingCustomer?.identityDocument?.idDocFrontUrl;
        let backUrl = existingCustomer?.identityDocument?.idDocBackUrl;
        // Handle file uploads if new files are provided
        const files = req.files;
        if (files?.idDocFrontFile) {
            const frontFile = files.idDocFrontFile;
            const frontStorageRef = storage.bucket().file(`identity_docs/${customerId}/front_${Date.now()}`);
            await frontStorageRef.save(frontFile.buffer, {
                metadata: {
                    contentType: frontFile.mimetype,
                },
            });
            [frontUrl] = await frontStorageRef.getSignedUrl({
                action: 'read',
                expires: '03-01-2500',
            });
        }
        if (files?.idDocBackFile) {
            const backFile = files.idDocBackFile;
            const backStorageRef = storage.bucket().file(`identity_docs/${customerId}/back_${Date.now()}`);
            await backStorageRef.save(backFile.buffer, {
                metadata: {
                    contentType: backFile.mimetype,
                },
            });
            [backUrl] = await backStorageRef.getSignedUrl({
                action: 'read',
                expires: '03-01-2500',
            });
        }
        // Create updated customer data object
        const customerData = {
            email,
            phone_number,
            first_name,
            last_name,
            dateOfBirth,
            ipAddress,
            taxId: taxId || '',
            address: {
                addressLine1,
                addressLine2: JSON.parse(address).addressLine2 || '',
                city,
                stateProvinceRegion,
                country,
                postalCode,
            },
            identityDocument: {
                idDocCountry,
                idDocType,
                idDocNumber,
                idDocFrontUrl: frontUrl,
                idDocBackUrl: backUrl,
            },
            updatedAt: new Date().toISOString(),
        };
        // Update in Firestore
        await db.collection('customers').doc(customerId).update(customerData);
        // Return success response
        res.status(200).json({
            id: customerId,
            ...customerData,
        });
    }
    catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({
            error: error.message || 'Failed to update customer'
        });
    }
});
