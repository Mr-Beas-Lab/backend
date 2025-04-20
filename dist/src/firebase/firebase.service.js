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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
const config_1 = require("@nestjs/config");
let FirebaseService = FirebaseService_1 = class FirebaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(FirebaseService_1.name);
        this.logger.log('Initializing Firebase Service...');
        // Validate Firebase configuration
        const projectId = this.configService.get('FIREBASE_PROJECT_ID') || process.env.FIREBASE_PROJECT_ID;
        const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL') || process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = this.configService.get('FIREBASE_PRIVATE_KEY') || process.env.FIREBASE_PRIVATE_KEY;
        if (!projectId || !clientEmail || !privateKey) {
            throw new Error('Missing Firebase configuration. Please check your environment variables: ' +
                'FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
        }
        // Initialize Firebase Admin SDK
        if (!admin.apps.length) {
            this.logger.log('No Firebase apps found, initializing new app...');
            const firebaseConfig = {
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            };
            try {
                admin.initializeApp({
                    credential: admin.credential.cert(firebaseConfig)
                });
                this.logger.log('Firebase app initialized successfully');
            }
            catch (error) {
                this.logger.error('Failed to initialize Firebase app:', error);
                throw error;
            }
        }
        else {
            this.logger.log('Using existing Firebase app');
        }
        this.firestore = admin.firestore();
    }
    getFirestore() {
        return this.firestore;
    }
    // Your existing CRUD operations remain exactly the same
    async createCustomer(customerData) {
        const customerRef = this.firestore.collection('customers').doc();
        await customerRef.set(customerData);
        return { id: customerRef.id, ...customerData };
    }
    async updateCustomer(customerId, customerData) {
        const customerRef = this.firestore.collection('customers').doc(customerId);
        await customerRef.update(customerData);
        return { id: customerId, ...customerData };
    }
    async getCustomer(customerId) {
        const customerRef = this.firestore.collection('customers').doc(customerId);
        const doc = await customerRef.get();
        if (!doc.exists) {
            throw new Error('Customer not found');
        }
        return { id: doc.id, ...doc.data() };
    }
    async getAllCustomers() {
        const snapshot = await this.firestore.collection('customers').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
