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
exports.approveReceipt = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_1 = __importDefault(require("../firebase"));
exports.approveReceipt = functions.https.onCall(async (request) => {
    const { receiptId, senderId, amount } = request.data;
    // Validate input
    if (!receiptId || !senderId || !amount) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields: receiptId, senderId, or amount");
    }
    try {
        // Use a Firestore transaction to ensure atomicity
        await firebase_1.default.firestore().runTransaction(async (transaction) => {
            const userRef = firebase_1.default.firestore().collection("users").doc(senderId);
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new functions.https.HttpsError("not-found", "User not found");
            }
            const userData = userDoc.data();
            const currentBalance = userData?.realBalance ?? 0;
            // Update the user's realBalance
            transaction.update(userRef, {
                realBalance: currentBalance + amount,
            });
            // Update the receipt status to "approved"
            const receiptRef = firebase_1.default.firestore().collection("receipts").doc(receiptId);
            transaction.update(receiptRef, { status: "approved" });
        });
        return { success: true, message: "Receipt approved and sender balance updated" };
    }
    catch (error) {
        console.error("Error in approveReceipt function:", error);
        throw new functions.https.HttpsError("internal", "Failed to approve receipt");
    }
});
