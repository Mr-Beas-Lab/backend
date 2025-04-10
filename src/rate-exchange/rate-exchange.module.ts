import { Module } from '@nestjs/common';
import { RateExchangeController } from './rate-exchange.controller';
import { ExternalApiService } from '@/external-api/external-api.service';
import { ExchangeRateService } from './rate-exchange.service';

@Module({
  controllers: [RateExchangeController],
  providers: [ExchangeRateService, ExternalApiService]
})
export class RateExchangeModule {}
