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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ExternalApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalApiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let ExternalApiService = ExternalApiService_1 = class ExternalApiService {
    constructor() {
        this.logger = new common_1.Logger(ExternalApiService_1.name);
        this.apiUrl = 'https://sandbox-api.kontigo.lat/v1';
        this.apiKey = process.env.KONTIGO_API_KEY;
        if (!this.apiKey) {
            this.logger.warn('KONTIGO_API_KEY environment variable is not set');
        }
    }
    convertAllValuesToString(obj) {
        if (obj === null || obj === undefined) {
            return '';
        }
        if (typeof obj === 'object') {
            const result = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    result[key] = this.convertAllValuesToString(obj[key]);
                }
            }
            return result;
        }
        return String(obj);
    }
    async sendCustomerToKontigo(customerData) {
        try {
            this.logger.log('Sending customer data to Kontigo API...');
            if (!this.apiKey) {
                throw new common_1.HttpException('Kontigo API key is not configured', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            // Convert all values to strings
            const stringifiedData = this.convertAllValuesToString(customerData);
            this.logger.log('Sending data to Kontigo API:', JSON.stringify(stringifiedData, null, 2));
            const response = await axios_1.default.post(`${this.apiUrl}/customers`, stringifiedData, {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-api-key': this.apiKey
                }
            });
            this.logger.log('Successfully sent customer data to Kontigo API');
            this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
            // Check if the response contains the expected data
            if (!response.data || !response.data.id) {
                this.logger.warn('Unexpected response format from Kontigo API:', response.data);
                throw new common_1.HttpException('Invalid response from Kontigo API: Missing customer ID', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error('Error sending customer data to Kontigo API:', error.response?.data || error.message);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data?.message || 'Error from Kontigo API';
                const errorDetails = error.response.data?.errors || error.response.data;
                this.logger.error('Kontigo API error details:', errorDetails);
                throw new common_1.HttpException({
                    message: errorMessage,
                    details: errorDetails
                }, error.response.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (error.request) {
                // The request was made but no response was received
                this.logger.error('No response received from Kontigo API');
                throw new common_1.HttpException('No response received from Kontigo API', common_1.HttpStatus.GATEWAY_TIMEOUT);
            }
            else {
                // Something happened in setting up the request that triggered an Error
                this.logger.error('Error setting up request to Kontigo API:', error.message);
                throw new common_1.HttpException('Error setting up request to Kontigo API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async sendBankAccountToKontigo(bankAccountData) {
        try {
            this.logger.log('Sending bank account data to Kontigo API...');
            if (!this.apiKey) {
                throw new common_1.HttpException('Kontigo API key is not configured', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            // Extract customer_id from bankAccountData
            const customerId = bankAccountData.customer_id;
            if (!customerId) {
                throw new common_1.HttpException('Customer ID is required to create a bank account', common_1.HttpStatus.BAD_REQUEST);
            }
            // Format the data according to Kontigo API requirements
            // Using the exact format specified by the user
            const formattedData = {
                bank_code: bankAccountData.bank_code,
                country_code: bankAccountData.country_code.toUpperCase(),
                beneficiary_name: bankAccountData.beneficiary_name,
                account_number: bankAccountData.account_number,
                id_doc_number: bankAccountData.id_doc_number,
                phone_number: bankAccountData.phone_number ?
                    bankAccountData.phone_number.startsWith('+') ?
                        bankAccountData.phone_number :
                        `+${bankAccountData.phone_number}` :
                    undefined,
                account_type: bankAccountData.account_type.toLowerCase()
            };
            // Remove undefined values
            Object.keys(formattedData).forEach((key) => {
                if (formattedData[key] === undefined) {
                    delete formattedData[key];
                }
            });
            this.logger.log('Sending data to Kontigo API:', JSON.stringify(formattedData, null, 2));
            // Use the correct endpoint format for bank accounts
            const response = await axios_1.default.post(`${this.apiUrl}/customers/${customerId}/bank-accounts`, formattedData, {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-api-key': this.apiKey,
                    'x-api-version': '2024-01-01'
                }
            });
            this.logger.log('Successfully sent bank account data to Kontigo API');
            this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
            // Check if the response contains the expected data
            if (!response.data || !response.data.id) {
                this.logger.warn('Unexpected response format from Kontigo API:', response.data);
                throw new common_1.HttpException('Invalid response from Kontigo API: Missing bank account ID', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error('Error sending bank account data to Kontigo API:', error.response?.data || error.message);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data?.message || 'Error from Kontigo API';
                const errorDetails = error.response.data?.errors || error.response.data;
                this.logger.error('Kontigo API error details:', errorDetails);
                // Check for specific validation errors
                if (error.response.status === 400) {
                    this.logger.error('Validation error from Kontigo API. Full response:', JSON.stringify(error.response.data, null, 2));
                    // If there are specific validation errors, include them in the error message
                    if (error.response.data?.errors) {
                        const validationErrors = Object.entries(error.response.data.errors)
                            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                            .join('; ');
                        throw new common_1.HttpException({
                            message: `Validation error: ${validationErrors}`,
                            details: error.response.data
                        }, common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                throw new common_1.HttpException({
                    message: errorMessage,
                    details: errorDetails
                }, error.response.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (error.request) {
                // The request was made but no response was received
                this.logger.error('No response received from Kontigo API');
                throw new common_1.HttpException('No response received from Kontigo API', common_1.HttpStatus.GATEWAY_TIMEOUT);
            }
            else {
                // Something happened in setting up the request that triggered an Error
                this.logger.error('Error setting up request to Kontigo API:', error.message);
                throw new common_1.HttpException('Error setting up request to Kontigo API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateBankAccountInKontigo(bankAccountId, updateData) {
        try {
            this.logger.log(`Updating bank account ${bankAccountId} in Kontigo API...`);
            if (!this.apiKey) {
                throw new common_1.HttpException('Kontigo API key is not configured', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            // Convert all values to strings
            const stringifiedData = this.convertAllValuesToString(updateData);
            this.logger.log('Sending update data to Kontigo API:', JSON.stringify(stringifiedData, null, 2));
            // Get the customer ID from the bank account data in Firestore
            // This is a workaround since we don't have the customer ID in the update data
            // In a real implementation, you would need to pass the customer ID to this method
            const customerId = updateData.customer_id;
            if (!customerId) {
                throw new common_1.HttpException('Customer ID is required to update a bank account', common_1.HttpStatus.BAD_REQUEST);
            }
            const response = await axios_1.default.patch(`${this.apiUrl}/customers/${customerId}/bank-accounts/${bankAccountId}`, stringifiedData, {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-api-key': this.apiKey
                }
            });
            this.logger.log('Successfully updated bank account in Kontigo API');
            this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
            return response.data;
        }
        catch (error) {
            this.logger.error('Error updating bank account in Kontigo API:', error.response?.data || error.message);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data?.message || 'Error from Kontigo API';
                const errorDetails = error.response.data?.errors || error.response.data;
                this.logger.error('Kontigo API error details:', errorDetails);
                throw new common_1.HttpException({
                    message: errorMessage,
                    details: errorDetails
                }, error.response.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (error.request) {
                // The request was made but no response was received
                this.logger.error('No response received from Kontigo API');
                throw new common_1.HttpException('No response received from Kontigo API', common_1.HttpStatus.GATEWAY_TIMEOUT);
            }
            else {
                // Something happened in setting up the request that triggered an Error
                this.logger.error('Error setting up request to Kontigo API:', error.message);
                throw new common_1.HttpException('Error setting up request to Kontigo API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async deleteBankAccountFromKontigo(bankAccountId, customerId) {
        try {
            this.logger.log(`Deleting bank account ${bankAccountId} from Kontigo API...`);
            if (!this.apiKey) {
                throw new common_1.HttpException('Kontigo API key is not configured', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!customerId) {
                throw new common_1.HttpException('Customer ID is required to delete a bank account', common_1.HttpStatus.BAD_REQUEST);
            }
            const response = await axios_1.default.delete(`${this.apiUrl}/customers/${customerId}/bank-accounts/${bankAccountId}`, {
                headers: {
                    'accept': 'application/json',
                    'x-api-key': this.apiKey
                }
            });
            this.logger.log('Successfully deleted bank account from Kontigo API');
            this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
            return response.data;
        }
        catch (error) {
            this.logger.error('Error deleting bank account from Kontigo API:', error.response?.data || error.message);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data?.message || 'Error from Kontigo API';
                const errorDetails = error.response.data?.errors || error.response.data;
                this.logger.error('Kontigo API error details:', errorDetails);
                throw new common_1.HttpException({
                    message: errorMessage,
                    details: errorDetails
                }, error.response.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (error.request) {
                // The request was made but no response was received
                this.logger.error('No response received from Kontigo API');
                throw new common_1.HttpException('No response received from Kontigo API', common_1.HttpStatus.GATEWAY_TIMEOUT);
            }
            else {
                // Something happened in setting up the request that triggered an Error
                this.logger.error('Error setting up request to Kontigo API:', error.message);
                throw new common_1.HttpException('Error setting up request to Kontigo API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.ExternalApiService = ExternalApiService;
exports.ExternalApiService = ExternalApiService = ExternalApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ExternalApiService);
