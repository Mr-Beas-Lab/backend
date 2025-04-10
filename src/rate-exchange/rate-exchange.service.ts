// exchange-rate.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ExternalApiService } from '../external-api/external-api.service';

@Injectable()
export class ExchangeRateService {
  constructor(private readonly externalApiService: ExternalApiService) {}

  async getExchangeRate(sourceCurrency: string, destinationCurrency: string) {
    try {
      return await this.externalApiService.getExchangeRate(sourceCurrency, destinationCurrency);
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new HttpException(
              'Bad Request – Invalid currency code or missing parameters',
              HttpStatus.BAD_REQUEST,
            );
          case 404:
            throw new HttpException(
              'Exchange rate not found',
              HttpStatus.NOT_FOUND,
            );
          default:
            throw new HttpException(
              error.response.data?.message || 'Internal Server Error',
              error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      } else {
        throw new HttpException(
          'Failed to fetch exchange rate',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}