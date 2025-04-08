import { Test, TestingModule } from '@nestjs/testing';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './quote.dto';

describe('QuoteService', () => {
  let service: QuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteService],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a quote', () => {
    const customerId = 'cus_12345'; 
    const createQuoteDto: CreateQuoteDto = {
      amount: 1000,
      sourceCurrency: 'USDC',
      destinationCurrency: 'VES',
      destinationAccountId: 'destination_account',
      fees_paid_by: 'customer',
    };

    const result = service.createQuote(customerId, createQuoteDto); // Pass customerId separately
    expect(result).toEqual({
      message: 'Quote generated successfully',
      data: {
        amount: 1000,
        customerId: '12345',
        source: {
          currency: 'USDC',
          account_id: 'ba_source123',
        },
        destination: {
          currency: 'VES',
          account_id: 'destination_account',
          payment_rail: 'pagomovil',
        },
        fees_paid_by: 'customer',
      },
    });
  });
});