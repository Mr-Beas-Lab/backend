import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { ExternalApiModule } from 'src/external-api/external-api.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [ExternalApiModule, FirebaseModule],
  providers: [BankAccountsService],
  exports: [BankAccountsService]
})
export class BankAccountsModule {} 