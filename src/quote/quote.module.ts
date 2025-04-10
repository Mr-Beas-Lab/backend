import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { ExternalApiModule } from '@/external-api/external-api.module';
import { FirebaseModule } from '@/firebase/firebase.module';

@Module({
  imports: [FirebaseModule,ExternalApiModule],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}