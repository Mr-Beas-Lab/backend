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
exports.createAdminUser = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_1 = __importDefault(require("../firebase"));
const db = firebase_1.default.firestore();
exports.createAdminUser = functions.https.onCall(async (request) => {
    const data = request.data; // Extract input data
    const context = request.auth; // Extract authentication context
    // Ensure only Super Admins can create admins
    if (!context?.token?.superadmin) {
        throw new functions.https.HttpsError("permission-denied", "Only superadmins can create admin users");
    }
    let user = null; // Explicitly type user
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
                uid: user.uid,
                role: "admin",
                createdAt: firebase_1.default.firestore.FieldValue.serverTimestamp(),
            });
        });
        // Step 3: Set Custom Claims (Directly using Admin SDK)
        await firebase_1.default.auth().setCustomUserClaims(user.uid, { role: "admin" });
        return { message: "Admin user created successfully", uid: user.uid };
    }
    catch (error) {
        console.error("Error:", error);
        // Rollback: Delete User if Firestore or Custom Claims Fail
        if (user) {
            await firebase_1.default.auth().deleteUser(user.uid);
        }
        throw new functions.https.HttpsError("internal", error.message);
    }
});
