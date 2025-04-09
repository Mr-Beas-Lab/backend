"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dm_deposit_details_controller_1 = require("./dm-deposit-details.controller");
describe('DmDepositDetailsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [dm_deposit_details_controller_1.DmDepositDetailsController],
        }).compile();
        controller = module.get(dm_deposit_details_controller_1.DmDepositDetailsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
