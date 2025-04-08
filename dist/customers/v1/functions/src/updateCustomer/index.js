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
exports.updateCustomer = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_1 = __importDefault(require("../firebase"));
const storage_1 = require("firebase-admin/storage");
exports.updateCustomer = functions.https.onCall(async (request) => {
    const data = request.data;
    const context = request.auth;
    // Check if user is authenticated
    if (!context) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    try {
        const db = firebase_1.default.firestore();
        const storage = (0, storage_1.getStorage)();
        const bucket = storage.bucket();
        // Check if customer exists
        const customerRef = db.collection('customers').doc(data.customerId);
        const customerDoc = await customerRef.get();
        if (!customerDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Customer not found');
        }
        // Prepare update data
        const updateData = {
            email: data.email,
            phone_number: data.phone_number,
            first_name: data.first_name,
            last_name: data.last_name,
            dateOfBirth: data.dateOfBirth,
            ipAddress: data.ipAddress,
            taxId: data.taxId,
            address: data.address,
            identityDocument: data.identityDocument,
            updatedAt: firebase_1.default.firestore.Timestamp.now()
        };
        // Upload identity documents if provided
        const updates = {};
        if (data.idDocFrontFile) {
            const frontStorageRef = bucket.file(`identity_docs/${data.customerId}/front_${Date.now()}`);
            await frontStorageRef.save(Buffer.from(data.idDocFrontFile, 'base64'), {
                metadata: {
                    contentType: 'image/jpeg',
                },
            });
            const frontDownloadURL = await frontStorageRef.getSignedUrl({
                action: 'read',
                expires: '03-01-2500',
            });
            updates['identityDocument.idDocFrontUrl'] = frontDownloadURL[0];
        }
        if (data.idDocBackFile) {
            const backStorageRef = bucket.file(`identity_docs/${data.customerId}/back_${Date.now()}`);
            await backStorageRef.save(Buffer.from(data.idDocBackFile, 'base64'), {
                metadata: {
                    contentType: 'image/jpeg',
                },
            });
            const backDownloadURL = await backStorageRef.getSignedUrl({
                action: 'read',
                expires: '03-01-2500',
            });
            updates['identityDocument.idDocBackUrl'] = backDownloadURL[0];
        }
        // Update document with file URLs and other data
        await customerRef.update({
            ...updateData,
            ...updates
        });
        // Get the latest document data
        const updatedDoc = await customerRef.get();
        const responseData = { id: updatedDoc.id, ...updatedDoc.data() };
        return {
            success: true,
            data: responseData
        };
    }
    catch (error) {
        console.error('Error updating customer:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Failed to update customer account');
    }
});
