import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { ExternalApiModule } from '../external-api/external-api.module';
import { BankAccountsModule } from '../bank-accounts/bank-accounts.module';

@Module({
  imports: [FirebaseModule, ExternalApiModule, BankAccountsModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService]
})
export class CustomersModule {}