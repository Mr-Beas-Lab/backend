import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { CustomersModule } from './customers/customers.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
 import { QuotenestService } from './generate/quotenest/quotenest.service';
import { QuoteModule } from './quote/quote.module';

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
  ],
  providers: [ QuotenestService],
})
export class AppModule {}