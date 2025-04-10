import { Test, TestingModule } from '@nestjs/testing';
import { RateExchangeController } from './rate-exchange.controller';

describe('RateExchangeController', () => {
  let controller: RateExchangeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateExchangeController],
    }).compile();

    controller = module.get<RateExchangeController>(RateExchangeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
