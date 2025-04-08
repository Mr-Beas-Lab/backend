"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const quotenest_service_1 = require("./quotenest.service");
describe('QuotenestService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [quotenest_service_1.QuotenestService],
        }).compile();
        service = module.get(quotenest_service_1.QuotenestService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
