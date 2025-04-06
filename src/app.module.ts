import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [CustomersModule, FirebaseModule],
})
export class AppModule {}