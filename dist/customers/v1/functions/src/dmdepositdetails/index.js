"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dmdepositdetail = void 0;
const https_1 = require("firebase-functions/v2/https");
const axios_1 = __importDefault(require("axios"));
exports.dmdepositdetail = (0, https_1.onCall)({
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 60,
    maxInstances: 10
}, async (request) => {
    const data = request.data;
    try {
        if (!data?.jsonData || !data?.telegramId) {
            throw new Error('Missing required fields');
        }
        const { jsonData, telegramId } = data;
        const { paymentMethod, ambassador } = jsonData;
        const encodeBase64URL = (data) => {
            return Buffer.from(data).toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        };
        const receiptData = JSON.stringify({
            ambassador: {
                id: ambassador.id,
                name: `${ambassador.firstName} ${ambassador.lastName}`,
                username: ambassador.tgUsername
            },
            payment: {
                bank: paymentMethod.details.bankName,
                account: paymentMethod.details.accountNumber,
                type: paymentMethod.type
            },
            timestamp: Date.now()
        });
        const encodedData = encodeBase64URL(receiptData);
        // Create deep link to your mini app with the reference ID
        const miniAppUrl = `https://t.me/mrbeasapp_bot/app?startapp=${encodedData}`;
        const message = `💰 *Payment Details*\n\n` +
            `*Ambassador*: ${ambassador.firstName} ${ambassador.lastName}\n` +
            `*Telegram Username*: @${ambassador.tgUsername}\n` +
            `*Bank Name*: ${paymentMethod.details.bankName}\n` +
            `*Account Number*: ${paymentMethod.details.accountNumber}`;
        const botToken = '7504377230:AAF5T7Yu3Marxe2f-KudsOQ4ot_O_zQeiiA';
        const tgResponse = await axios_1.default.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: telegramId,
            text: message,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[
                        {
                            text: '📤 Upload Receipt',
                            url: miniAppUrl
                        }
                    ]]
            }
        });
        return {
            success: true,
            data: {
                ...tgResponse.data,
            }
        };
    }
    catch (error) {
        console.error('Error:', error);
        throw new Error(error.message || 'Internal server error');
    }
});
