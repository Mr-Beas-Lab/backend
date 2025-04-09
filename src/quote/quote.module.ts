import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { ExternalApiModule } from '@/external-api/external-api.module';

@Module({
  imports: [ExternalApiModule],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}