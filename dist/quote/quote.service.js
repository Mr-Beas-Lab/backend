"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteService = void 0;
const common_1 = require("@nestjs/common");
let QuoteService = class QuoteService {
    createQuote(customerId, createQuoteDto) {
        const { amount, sourceCurrency, destinationCurrency, destinationAccountId, fees_paid_by } = createQuoteDto;
        // Default values for missing properties
        const source = {
            currency: sourceCurrency || 'USDC', // Default to 'USDC' if not provided
            account_id: 'ba_source123', // Example default source account ID
        };
        const destination = {
            currency: destinationCurrency || 'VES', // Default to 'VES' if not provided
            account_id: destinationAccountId, // Must be provided
            payment_rail: 'pagomovil', // Default payment rail
        };
        // Returning the generated quote
        return {
            message: 'Quote generated successfully',
            data: {
                amount,
                customerId,
                source,
                destination,
                fees_paid_by: fees_paid_by || 'source', // Default to 'source' if not provided
            },
        };
    }
};
exports.QuoteService = QuoteService;
exports.QuoteService = QuoteService = __decorate([
    (0, common_1.Injectable)()
], QuoteService);
