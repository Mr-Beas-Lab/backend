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
exports.confirmTransferQuote = void 0;
const functions = __importStar(require("firebase-functions"));
const axios_1 = __importDefault(require("axios"));
const KONTIGO_API_BASE_URL = "https://sandbox-api.kontigo.lat/v1";
const KONTIGO_API_KEY = ' ';
exports.confirmTransferQuote = functions.https.onRequest(async (req, res) => {
    // CORS setup
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    try {
        const { quoteId } = req.body;
        if (!quoteId) {
            res.status(400).json({ error: "Missing quoteId" });
            return;
        }
        const response = await axios_1.default.post(`${KONTIGO_API_BASE_URL}/transfers/quote/${quoteId}/confirm`, {}, // Empty body
        {
            headers: {
                "x-api-key": KONTIGO_API_KEY,
                "accept": "application/json",
            },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Confirmation error:", error);
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to confirm transfer quote";
        res.status(500).json({ error: errorMessage });
    }
});
