import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DmDepositDetailsService } from './dm-deposit-details.service';
import { DmDepositDetailsController } from './dm-deposit-details.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  providers: [DmDepositDetailsService],
  controllers: [DmDepositDetailsController]
})
export class DmDepositDetailsModule {}
