import { Test, TestingModule } from '@nestjs/testing';
import { QuotenestService } from './quotenest.service';

describe('QuotenestService', () => {
  let service: QuotenestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotenestService],
    }).compile();

    service = module.get<QuotenestService>(QuotenestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
