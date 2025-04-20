"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dm_deposit_details_service_1 = require("./dm-deposit-details.service");
describe('DmDepositDetailsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [dm_deposit_details_service_1.DmDepositDetailsService],
        }).compile();
        service = module.get(dm_deposit_details_service_1.DmDepositDetailsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
