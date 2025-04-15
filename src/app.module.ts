import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { CustomersModule } from './customers/customers.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
 import { QuotenestService } from './generate/quotenest/quotenest.service';
import { QuoteModule } from './quote/quote.module';
import { DmDepositDetailsModule } from './dm-deposit-details/dm-deposit-details.module';
import { RateExchangeModule } from './rate-exchange/rate-exchange.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    CustomersModule,
    ExternalApiModule,
    BankAccountsModule,
    QuoteModule,
    DmDepositDetailsModule,
    RateExchangeModule,
  ],
  providers: [ QuotenestService],
  controllers: [HealthController],
})
export class AppModule {}