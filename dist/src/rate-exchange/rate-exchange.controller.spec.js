"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const rate_exchange_controller_1 = require("./rate-exchange.controller");
describe('RateExchangeController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [rate_exchange_controller_1.RateExchangeController],
        }).compile();
        controller = module.get(rate_exchange_controller_1.RateExchangeController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
