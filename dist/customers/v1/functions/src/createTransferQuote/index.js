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
exports.createTransferQuote = void 0;
const functions = __importStar(require("firebase-functions"));
const axios_1 = __importDefault(require("axios"));
// Kontigo API Config
const KONTIGO_API_BASE_URL = "https://sandbox-api.kontigo.lat/v1";
const KONTIGO_API_KEY = "your_kontigo_api_key_here";
exports.createTransferQuote = functions.https.onRequest(async (req, res) => {
    // CORS handling (adjust origins as needed)
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    // Handle preflight request
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    // Only allow POST requests
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    try {
        // Validate request body
        const { amount, sourceCurrency = 'USDC', sourceAccountId = 'cust_01234', destinationCurrency = 'VES', destinationAccountId } = req.body;
        if (!amount || !sourceCurrency || !sourceAccountId || !destinationCurrency || !destinationAccountId) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        // Convert amount to minor units (cents)
        const amountInMinorUnits = Math.round(parseFloat(amount) * 100);
        // Make request to Kontigo API
        const response = await axios_1.default.post(`${KONTIGO_API_BASE_URL}/transfers/quote`, {
            amount: amountInMinorUnits,
            source: {
                currency: sourceCurrency,
                account_id: sourceAccountId,
            },
            destination: {
                currency: destinationCurrency,
                account_id: destinationAccountId,
            },
            fees_paid_by: "source", // or "destination" based on your logic
        }, {
            headers: {
                "x-api-key": KONTIGO_API_KEY,
                "accept": "application/json",
                "content-type": "application/json",
            },
        });
        // Return the quote data to the client
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Quote creation error:", error);
        // Extract error message from Kontigo API or default to a generic message
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to create transfer quote";
        res.status(500).json({ error: errorMessage });
    }
});
