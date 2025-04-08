"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const quote_service_1 = require("./quote.service");
describe('QuoteService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [quote_service_1.QuoteService],
        }).compile();
        service = module.get(quote_service_1.QuoteService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should generate a quote', () => {
        const customerId = 'cus_12345';
        const createQuoteDto = {
            amount: 1000,
            sourceCurrency: 'USDC',
            destinationCurrency: 'VES',
            destinationAccountId: 'destination_account',
            fees_paid_by: 'customer',
        };
        const result = service.createQuote(customerId, createQuoteDto); // Pass customerId separately
        expect(result).toEqual({
            message: 'Quote generated successfully',
            data: {
                amount: 1000,
                customerId: '12345',
                source: {
                    currency: 'USDC',
                    account_id: 'ba_source123',
                },
                destination: {
                    currency: 'VES',
                    account_id: 'destination_account',
                    payment_rail: 'pagomovil',
                },
                fees_paid_by: 'customer',
            },
        });
    });
});
