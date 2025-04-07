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
var BankAccountsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountsService = void 0;
const common_1 = require("@nestjs/common");
const external_api_service_1 = require("../external-api/external-api.service");
const firebase_service_1 = require("../firebase/firebase.service");
let BankAccountsService = BankAccountsService_1 = class BankAccountsService {
    constructor(externalApiService, firebaseService) {
        this.externalApiService = externalApiService;
        this.firebaseService = firebaseService;
        this.logger = new common_1.Logger(BankAccountsService_1.name);
    }
    async create(createBankAccountDto, customerId) {
        try {
            this.logger.log('Creating bank account in Kontigo API...');
            // Set default values for country_code and account_type if not provided
            const bankAccountData = {
                ...createBankAccountDto,
                country_code: createBankAccountDto.country_code || 'VE',
                account_type: createBankAccountDto.account_type || 'bankaccount',
                customer_id: customerId
            };
            // Format the bank account data according to Kontigo API requirements
            const formattedBankAccountData = {
                bank_code: bankAccountData.bank_code,
                country_code: bankAccountData.country_code.toUpperCase(),
                beneficiary_name: bankAccountData.beneficiary_name || '',
                account_number: bankAccountData.account_number || '',
                id_doc_number: bankAccountData.id_doc_number,
                account_type: bankAccountData.account_type.toLowerCase(),
                customer_id: bankAccountData.customer_id,
                phone_number: bankAccountData.phone_number || ''
            };
            this.logger.log('Formatted bank account data:', JSON.stringify(formattedBankAccountData, null, 2));
            // Send data to Kontigo API
            const kontigoResponse = await this.externalApiService.sendBankAccountToKontigo(formattedBankAccountData);
            this.logger.log('Bank account created in Kontigo API:', kontigoResponse);
            // Verify that we have a valid bank account ID from Kontigo
            if (!kontigoResponse.id) {
                throw new common_1.HttpException('Invalid response from Kontigo API: Missing bank account ID', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            // Store bank account data in Firestore
            const firestoreData = {
                kontigoBankAccountId: kontigoResponse.id,
                customer_id: bankAccountData.customer_id,
                bank_code: bankAccountData.bank_code,
                country_code: bankAccountData.country_code,
                beneficiary_name: bankAccountData.beneficiary_name || '',
                account_number: bankAccountData.account_number || '',
                id_doc_number: bankAccountData.id_doc_number,
                account_type: bankAccountData.account_type,
                phone_number: bankAccountData.phone_number || '',
                createdAt: new Date().toISOString()
            };
            // Log the bank account data before saving to Firestore
            this.logger.log('Saving bank account data to Firestore:', firestoreData);
            // Save to Firestore
            const firestore = this.firebaseService.getFirestore();
            const bankAccountRef = await firestore.collection('bank_accounts').add(firestoreData);
            this.logger.log('Bank account data stored in Firestore with ID:', bankAccountRef.id);
            this.logger.log('Stored Kontigo bank account ID:', firestoreData.kontigoBankAccountId);
            // Update customer document with bank account ID
            const customerRef = firestore.collection('customers').doc(customerId);
            await customerRef.update({
                bankAccountId: kontigoResponse.id
            });
            this.logger.log('Updated customer document with bank account ID:', kontigoResponse.id);
            return {
                id: bankAccountRef.id,
                ...firestoreData
            };
        }
        catch (error) {
            this.logger.error('Error creating bank account:', error);
            throw error;
        }
    }
    async update(id, updateBankAccountDto) {
        try {
            this.logger.log(`Updating bank account with ID ${id} in Kontigo API...`);
            // Get the bank account from Firestore to get the Kontigo ID
            const firestore = this.firebaseService.getFirestore();
            const bankAccountDoc = await firestore.collection('bank_accounts').doc(id).get();
            if (!bankAccountDoc.exists) {
                throw new common_1.HttpException('Bank account not found', common_1.HttpStatus.NOT_FOUND);
            }
            const bankAccountData = bankAccountDoc.data();
            if (!bankAccountData) {
                throw new common_1.HttpException('Bank account data is empty', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const kontigoBankAccountId = bankAccountData.kontigoBankAccountId;
            const customerId = bankAccountData.customer_id;
            if (!customerId) {
                throw new common_1.HttpException('Customer ID is missing from bank account data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            // Add customer_id to the update data
            const updateData = {
                ...updateBankAccountDto,
                customer_id: customerId
            };
            // Send update data to Kontigo API
            const kontigoResponse = await this.externalApiService.updateBankAccountInKontigo(kontigoBankAccountId, updateData);
            this.logger.log('Bank account updated in Kontigo API:', kontigoResponse);
            // Update the bank account in Firestore
            const updatedBankAccountData = {
                ...bankAccountData,
                ...updateBankAccountDto,
                updatedAt: new Date().toISOString()
            };
            // Remove undefined values
            Object.keys(updatedBankAccountData).forEach((key) => {
                if (updatedBankAccountData[key] === undefined) {
                    delete updatedBankAccountData[key];
                }
            });
            await firestore.collection('bank_accounts').doc(id).update(updatedBankAccountData);
            this.logger.log('Bank account updated in Firestore with ID:', id);
            return {
                id,
                ...updatedBankAccountData
            };
        }
        catch (error) {
            this.logger.error('Error updating bank account:', error);
            throw error;
        }
    }
    async findAll() {
        try {
            const firestore = this.firebaseService.getFirestore();
            const snapshot = await firestore.collection('bank_accounts').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }
        catch (error) {
            this.logger.error('Error finding all bank accounts:', error);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const firestore = this.firebaseService.getFirestore();
            const doc = await firestore.collection('bank_accounts').doc(id).get();
            if (!doc.exists) {
                throw new common_1.HttpException('Bank account not found', common_1.HttpStatus.NOT_FOUND);
            }
            const bankAccountData = doc.data();
            if (!bankAccountData) {
                throw new common_1.HttpException('Bank account data is empty', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const kontigoBankAccountId = bankAccountData.kontigoBankAccountId;
            return {
                id: doc.id,
                ...bankAccountData
            };
        }
        catch (error) {
            this.logger.error('Error finding bank account:', error);
            throw error;
        }
    }
    async findByCustomerId(customerId) {
        try {
            const firestore = this.firebaseService.getFirestore();
            const snapshot = await firestore
                .collection('bank_accounts')
                .where('customer_id', '==', customerId)
                .get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }
        catch (error) {
            this.logger.error('Error finding bank accounts by customer ID:', error);
            throw error;
        }
    }
    async remove(id) {
        try {
            const firestore = this.firebaseService.getFirestore();
            const doc = await firestore.collection('bank_accounts').doc(id).get();
            if (!doc.exists) {
                throw new common_1.HttpException('Bank account not found', common_1.HttpStatus.NOT_FOUND);
            }
            const bankAccountData = doc.data();
            if (!bankAccountData) {
                throw new common_1.HttpException('Bank account data is empty', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const kontigoBankAccountId = bankAccountData.kontigoBankAccountId;
            const customerId = bankAccountData.customer_id;
            if (!customerId) {
                throw new common_1.HttpException('Customer ID is missing from bank account data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            // Delete from Kontigo API
            await this.externalApiService.deleteBankAccountFromKontigo(kontigoBankAccountId, customerId);
            // Delete from Firestore
            await firestore.collection('bank_accounts').doc(id).delete();
            return { id, deleted: true };
        }
        catch (error) {
            this.logger.error('Error removing bank account:', error);
            throw error;
        }
    }
};
exports.BankAccountsService = BankAccountsService;
exports.BankAccountsService = BankAccountsService = BankAccountsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [external_api_service_1.ExternalApiService,
        firebase_service_1.FirebaseService])
], BankAccountsService);
