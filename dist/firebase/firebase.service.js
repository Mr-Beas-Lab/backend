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
const serviceAccount = __importStar(require("../../firebase-service-account.json"));
let FirebaseService = FirebaseService_1 = class FirebaseService {
    constructor() {
        this.logger = new common_1.Logger(FirebaseService_1.name);
        this.defaultBucketName = 'mrjohn-8ee8b.firebasestorage.app';
        this.logger.log('Initializing Firebase Service...');
        this.logger.log(`Default bucket name: ${this.defaultBucketName}`);
        // Initialize Firebase Admin SDK
        if (!admin.apps.length) {
            this.logger.log('No Firebase apps found, initializing new app...');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: this.defaultBucketName,
            });
            this.logger.log('Firebase app initialized with bucket:', admin.app().options.storageBucket);
        }
        else {
            this.logger.log('Using existing Firebase app with bucket:', admin.app().options.storageBucket);
            // Force update the bucket name
            admin.app().options.storageBucket = this.defaultBucketName;
            this.logger.log('Updated bucket name to:', admin.app().options.storageBucket);
        }
        this.firestore = admin.firestore();
        this.storage = admin.storage();
        // Ensure bucket exists and log the bucket name being used
        this.ensureBucketExists();
    }
    async ensureBucketExists() {
        try {
            const bucket = this.storage.bucket(this.defaultBucketName);
            this.logger.log(`Checking if bucket ${this.defaultBucketName} exists...`);
            const [exists] = await bucket.exists();
            if (!exists) {
                this.logger.warn(`Bucket ${this.defaultBucketName} does not exist.`);
                this.logger.warn('Please create it in the Firebase Console:');
                this.logger.warn(`https://console.firebase.google.com/project/${serviceAccount.project_id}/storage`);
            }
            else {
                this.logger.log(`Bucket ${this.defaultBucketName} exists and is accessible.`);
            }
        }
        catch (error) {
            this.logger.error(`Error checking bucket: ${error.message}`);
            throw error;
        }
    }
    getFirestore() {
        return this.firestore;
    }
    getStorage() {
        return this.storage;
    }
    getBucketName() {
        // Always return the default bucket name
        return this.defaultBucketName;
    }
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
    __metadata("design:paramtypes", [])
], FirebaseService);
