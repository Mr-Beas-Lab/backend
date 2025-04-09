import { Module } from '@nestjs/common';
import { DmDepositDetailsService } from './dm-deposit-details.service';
import { DmDepositDetailsController } from './dm-deposit-details.controller';

@Module({
  providers: [DmDepositDetailsService],
  controllers: [DmDepositDetailsController]
})
export class DmDepositDetailsModule {}
