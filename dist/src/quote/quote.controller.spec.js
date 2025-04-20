"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const quote_controller_1 = require("./quote.controller");
describe('QuoteController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [quote_controller_1.QuoteController],
        }).compile();
        controller = module.get(quote_controller_1.QuoteController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
