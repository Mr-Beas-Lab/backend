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
exports.getExchangeRate = void 0;
const functions = __importStar(require("firebase-functions"));
const axios_1 = __importDefault(require("axios"));
exports.getExchangeRate = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");
    const { source_currency, destination_currency } = req.query;
    if (!source_currency || !destination_currency) {
        res.status(400).json({ error: "Missing currency parameters" });
        return;
    }
    try {
        const response = await axios_1.default.get("https://sandbox-api.kontigo.lat/v1/organizations/org_jxo76fiqgy3zkhi/exchange-rates", {
            params: {
                source_currency,
                destination_currency
            },
            headers: {
                "x-api-key": "pk_CH59Nex4ByzhFrgfLOfqOYczJoQM5LqF6efBcpxBR8",
                "accept": "application/json",
            },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        if (error.response) {
            switch (error.response.statusCode) {
                case 400:
                    res.status(400).json({ error: "Bad Request – Invalid currency code or missing parameters." });
                    break;
                case 404:
                    res.status(404).json({ error: "Exchange rate not found." });
                    break;
                default:
                    res.status(error.response.status).json({ error: error.response.statusText });
            }
        }
        else {
            console.error("Kontigo API Error:", error);
            res.status(500).json({ error: "Failed to fetch exchange rate", details: error.message });
        }
    }
});
