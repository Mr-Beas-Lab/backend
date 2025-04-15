import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ExternalApiModule } from 'src/external-api/external-api.module';

@Module({
  imports: [FirebaseModule,ExternalApiModule],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}