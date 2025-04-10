// exchange-rate.controller.ts
import { Controller, Get, Query, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExchangeRateService } from './rate-exchange.service';
import { GetRateDto } from './rate-exchange.dto';

@ApiTags('exchange-rates')
@Controller('exchange-rates')
export class RateExchangeController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get()
  @ApiOperation({ summary: 'Get exchange rate between two currencies' })
  @ApiQuery({ name: 'source_currency', required: true, type: String })
  @ApiQuery({ name: 'destination_currency', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Exchange rate retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid currency parameters' })
  @ApiResponse({ status: 404, description: 'Exchange rate not found' })
  @ApiResponse({ status: 500, description: 'Failed to fetch exchange rate' })
  async getExchangeRate(@Query() query: GetRateDto) {
    return this.exchangeRateService.getExchangeRate(query.source_currency, query.destination_currency);
  }
}