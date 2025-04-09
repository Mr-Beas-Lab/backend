import { Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './quote.dto';
import { ExternalApiService } from '../external-api/external-api.service';

@Injectable()
export class QuoteService {
  constructor(private readonly externalApiService: ExternalApiService) {}

  async createQuote(customerId: string, createQuoteDto: CreateQuoteDto) {
    const { amount, sourceCurrency, destinationCurrency, destinationAccountId } = createQuoteDto;

    // Prepare the payload for the external API
    const payload = {
      amount,
      customer_id: customerId,
      source: {
        payment_rail: 'prefunded_account',
        currency: sourceCurrency || 'USDC',  
        account_id: process.env.PRE_FUNDED_ACCOUNT_ID  
      },
      destination: {
        currency: destinationCurrency || 'VES', 
        account_id: destinationAccountId,  
        payment_rail: 'pagomovil',  
      },
      fees_paid_by: 'source',  
    };

    // Call the external API to create the quote
    const response = await this.externalApiService.createQuote(customerId, payload);
    console.log('api response',response)
    // Return the response from the external API
    return response;
  }
}