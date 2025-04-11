import { Controller, Post, Body } from '@nestjs/common';
import { DmDepositDetailsService } from './dm-deposit-details.service';
import { DmDepositDetailsDto } from './dto/payment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('direct message deposit details')
@Controller('dm-deposit-details')
export class DmDepositDetailsController {
  constructor(private readonly dmDepositDetailsService: DmDepositDetailsService) {}

  @Post()
  @ApiOperation({ summary: 'Process DM deposit details and send Telegram message' })
  @ApiResponse({ status: 201, description: 'Successfully processed deposit details' })
  @ApiResponse({ status: 400, description: 'Bad request - Missing required fields' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async processDepositDetails(@Body() data: DmDepositDetailsDto) {
    return this.dmDepositDetailsService.processDepositDetails(data);
  }
}
