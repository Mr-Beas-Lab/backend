"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const rate_exchange_service_1 = require("./rate-exchange.service");
describe('RateExchangeService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [rate_exchange_service_1.ExchangeRateService],
        }).compile();
        service = module.get(rate_exchange_service_1.ExchangeRateService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
