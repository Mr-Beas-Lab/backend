import { Module } from '@nestjs/common';
import { RateExchangeController } from './rate-exchange.controller';
import { ExchangeRateService } from './rate-exchange.service';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Module({
  controllers: [RateExchangeController],
  providers: [ExchangeRateService, ExternalApiService]
})
export class RateExchangeModule {}
