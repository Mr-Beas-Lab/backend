import { Controller, Post, Body, Param, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateQuoteDto } from './quote.dto';
import { QuoteService } from './quote.service';

@ApiTags('quotes')
@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}


  @Post(':customerId/create')
  @ApiOperation({ summary: 'Create a new quote', description: 'Generates a quote based on the provided details.' })
  @ApiResponse({ status: 201, description: 'Quote created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createQuote(@Param('customerId') customerId: string, @Body() createQuoteDto: CreateQuoteDto) {
    return this.quoteService.createQuote(customerId, createQuoteDto);
  }

  @Post(':customerId/:quoteId/pay/:amount')
  @ApiOperation({ 
    summary: 'Confirm and pay a quote', 
    description: 'Executes payment for a previously created quote.' 
  })
  @ApiParam({ name: 'customerId', description: 'ID of the customer making the payment' })
  @ApiParam({ name: 'quoteId', description: 'ID of the quote to pay' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Payment processed successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid quote or payment data' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Quote not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Payment processing failed' 
  })
  async payQuote(
    @Param('customerId') customerId: string,
    @Param('quoteId') quoteId: string,
    @Param('amount') amount: number
   ) {
    return this.quoteService.payQuote(customerId, quoteId, amount);
  }
}
