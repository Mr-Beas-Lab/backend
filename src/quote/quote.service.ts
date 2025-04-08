import { Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './quote.dto';

@Injectable()
export class QuoteService {
  createQuote(customerId: string, createQuoteDto: CreateQuoteDto) {
    const { amount, sourceCurrency, destinationCurrency, destinationAccountId, fees_paid_by } = createQuoteDto;

    // Default values for missing properties
    const source = {
      currency: sourceCurrency || 'USDC', // Default to 'USDC' if not provided
      account_id: 'ba_source123', // Example default source account ID
    };

    const destination = {
      currency: destinationCurrency || 'VES', // Default to 'VES' if not provided
      account_id: destinationAccountId, // Must be provided
      payment_rail: 'pagomovil', // Default payment rail
    };

    // Returning the generated quote
    return {
      message: 'Quote generated successfully',
      data: {
        amount,
        customerId,
        source,
        destination,
        fees_paid_by: fees_paid_by || 'source', // Default to 'source' if not provided
      },
    };
  }
}
