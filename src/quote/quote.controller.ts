import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
}
