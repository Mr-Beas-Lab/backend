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
exports.claimTask = void 0;
// functions/api/index.ts
const functions = __importStar(require("firebase-functions"));
const firebase_1 = __importDefault(require("../firebase"));
// The rest of your code remains the same
exports.claimTask = functions.https.onCall(async (request) => {
    const { telegramId, taskId } = request.data;
    if (!telegramId || !taskId) {
        throw new functions.https.HttpsError('invalid-argument', 'Telegram ID and task ID are required.');
    }
    const userRef = firebase_1.default.firestore().doc(`users/${telegramId}`);
    const taskRef = firebase_1.default.firestore().doc(`tasks/${taskId}`);
    try {
        await firebase_1.default.firestore().runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const taskDoc = await transaction.get(taskRef);
            if (!taskDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Task not found.');
            }
            const taskPoint = taskDoc.data()?.point;
            if (!taskPoint) {
                throw new functions.https.HttpsError('invalid-argument', 'Task point is missing.');
            }
            const completedTasks = userDoc.data()?.completedTasks || [];
            if (completedTasks.includes(taskId)) {
                throw new functions.https.HttpsError('already-exists', 'Task already claimed.');
            }
            transaction.update(userRef, {
                balance: firebase_1.default.firestore.FieldValue.increment(taskPoint),
                completedTasks: firebase_1.default.firestore.FieldValue.arrayUnion(taskId),
            });
            transaction.update(taskRef, {
                completions: firebase_1.default.firestore.FieldValue.increment(1),
            });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error claiming task:', error);
        throw new functions.https.HttpsError('internal', 'Failed to claim task.');
    }
});
