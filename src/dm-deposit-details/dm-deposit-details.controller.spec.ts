import { Test, TestingModule } from '@nestjs/testing';
import { DmDepositDetailsController } from './dm-deposit-details.controller';

describe('DmDepositDetailsController', () => {
  let controller: DmDepositDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DmDepositDetailsController],
    }).compile();

    controller = module.get<DmDepositDetailsController>(DmDepositDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
