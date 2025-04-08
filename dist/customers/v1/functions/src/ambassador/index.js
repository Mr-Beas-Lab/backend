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
exports.createAmbassadorUser = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_1 = __importDefault(require("../firebase"));
const db = firebase_1.default.firestore();
exports.createAmbassadorUser = functions.https.onCall(async (request) => {
    const data = request.data; // Extract input data
    // Validate input data
    if (!data.email || !data.password || !data.firstName || !data.tgUsername || !data.lastName || !data.phone || !data.country) {
        throw new functions.https.HttpsError("invalid-argument", "All fields are required.");
    }
    let user = null;
    try {
        // Step 1: Create Firebase Auth User
        user = await firebase_1.default.auth().createUser({
            email: data.email,
            password: data.password,
        });
        // Step 2: Firestore Transaction
        await db.runTransaction(async (transaction) => {
            const userRef = db.collection("staffs").doc(user.uid);
            transaction.set(userRef, {
                firstName: data.firstName,
                lastName: data.lastName,
                tgUsername: data.tgUsername,
                email: data.email,
                phone: data.phone,
                country: data.country,
                uid: user.uid,
                kyc: "pending",
                role: "ambassador",
                createdAt: firebase_1.default.firestore.FieldValue.serverTimestamp(),
            });
        });
        // Step 3: Set Custom Claims (Directly using Admin SDK)
        await firebase_1.default.auth().setCustomUserClaims(user.uid, { role: "ambassador" }); // Use `role` field for consistency
        // Step 4: Send Email Verification (Optional)
        await firebase_1.default.auth().generateEmailVerificationLink(data.email);
        return { message: "Ambassador user created successfully", uid: user.uid };
    }
    catch (error) {
        console.error("Error:", error);
        // Rollback: Delete User if Firestore or Custom Claims Fail
        if (user) {
            await firebase_1.default.auth().deleteUser(user.uid);
        }
        // Handle specific errors
        if (error.code === "auth/email-already-exists") {
            throw new functions.https.HttpsError("already-exists", "Email is already in use.");
        }
        else if (error.code === "auth/invalid-email") {
            throw new functions.https.HttpsError("invalid-argument", "Invalid email address.");
        }
        else if (error.code === "auth/weak-password") {
            throw new functions.https.HttpsError("invalid-argument", "Password is too weak.");
        }
        else {
            throw new functions.https.HttpsError("internal", "An error occurred. Please try again.");
        }
    }
});
