import { Test, TestingModule } from '@nestjs/testing';
import { DmDepositDetailsService } from './dm-deposit-details.service';

describe('DmDepositDetailsService', () => {
  let service: DmDepositDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DmDepositDetailsService],
    }).compile();

    service = module.get<DmDepositDetailsService>(DmDepositDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
