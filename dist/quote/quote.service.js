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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteService = void 0;
const common_1 = require("@nestjs/common");
const external_api_service_1 = require("../external-api/external-api.service");
let QuoteService = class QuoteService {
    constructor(externalApiService) {
        this.externalApiService = externalApiService;
    }
    async createQuote(customerId, createQuoteDto) {
        const { amount, sourceCurrency, destinationCurrency, destinationAccountId } = createQuoteDto;
        // Prepare the payload for the external API
        const payload = {
            amount,
            customer_id: customerId,
            source: {
                payment_rail: 'prefunded_account',
                currency: sourceCurrency || 'USDC',
                account_id: process.env.PRE_FUNDED_ACCOUNT_ID
            },
            destination: {
                currency: destinationCurrency || 'VES',
                account_id: destinationAccountId,
                payment_rail: 'pagomovil',
            },
            fees_paid_by: 'source',
        };
        // Call the external API to create the quote
        const response = await this.externalApiService.createQuote(customerId, payload);
        console.log('api response', response);
        // Return the response from the external API
        return response;
    }
};
exports.QuoteService = QuoteService;
exports.QuoteService = QuoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [external_api_service_1.ExternalApiService])
], QuoteService);
