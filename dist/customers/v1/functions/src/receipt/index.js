"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReceipt = void 0;
const cors_1 = __importDefault(require("cors"));
const https_1 = require("firebase-functions/v2/https");
const firebase_1 = __importDefault(require("../firebase"));
const db = firebase_1.default.firestore();
const corsHandler = (0, cors_1.default)({ origin: true });
exports.createReceipt = (0, https_1.onRequest)({
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 60,
    maxInstances: 10
}, (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }
        try {
            const { ambassadorId, amount, senderTgId, documents, createdAt } = req.body;
            if (!ambassadorId || !amount || !senderTgId || !documents?.length) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            if (amount <= 0) {
                return res.status(400).json({ error: "Amount must be greater than 0" });
            }
            const timestamp = createdAt || new Date().toISOString();
            const newReceipt = {
                ambassadorId,
                amount,
                senderTgId,
                documents,
                createdAt: timestamp,
            };
            const receiptRef = await db.collection("receipts").add(newReceipt);
            return res.status(201).json({ id: receiptRef.id, ...newReceipt });
        }
        catch (error) {
            console.error("Error creating receipt:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
});
