"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CustomersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const external_api_service_1 = require("../external-api/external-api.service");
let CustomersService = CustomersService_1 = class CustomersService {
    constructor(firebaseService, externalApiService) {
        this.firebaseService = firebaseService;
        this.externalApiService = externalApiService;
        this.logger = new common_1.Logger(CustomersService_1.name);
    }
    async create(createCustomerDto) {
        try {
            this.logger.log('Creating customer in Kontigo API...');
            // Prepare data for Kontigo API
            const kontigoData = {
                type: createCustomerDto.type,
                email: createCustomerDto.email,
                phone_number: createCustomerDto.phone_number,
                first_name: createCustomerDto.legal_name, // Store legal_name as is
                last_name: '', // Empty string for last_name
                // Required default values for Kontigo API
                date_of_birth: new Date().toISOString().split('T')[0], // Current date as default
                country: 'VE',
                id_doc_type: 'national_id',
                id_doc_country: 'VE',
                kyc_type: 'document',
                purpose_of_transactions: 'personal',
                purpose_of_transactions_explanation: 'Personal transactions'
            };
            // Send data to Kontigo API
            const kontigoResponse = await this.externalApiService.sendCustomerToKontigo(kontigoData);
            this.logger.log('Customer created in Kontigo API:', kontigoResponse);
            // Store Kontigo customer ID with Telegram ID in Firestore
            const customerData = {
                kontigoCustomerId: kontigoResponse.id,
                telegram_id: createCustomerDto.telegram_id,
                email: createCustomerDto.email,
                legal_name: createCustomerDto.legal_name, // Store legal_name as is
                type: createCustomerDto.type,
                createdAt: new Date().toISOString()
            };
            // Save to Firestore
            const firestore = this.firebaseService.getFirestore();
            const customerRef = await firestore.collection('customers').add(customerData);
            this.logger.log('Customer data stored in Firestore with ID:', customerRef.id);
            return {
                id: customerRef.id,
                ...customerData
            };
        }
        catch (error) {
            this.logger.error('Error creating customer:', error);
            throw error;
        }
    }
    async findByTelegramId(telegramId) {
        const firestore = this.firebaseService.getFirestore();
        const snapshot = await firestore
            .collection('customers')
            .where('telegram_id', '==', telegramId)
            .get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = CustomersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        external_api_service_1.ExternalApiService])
], CustomersService);
