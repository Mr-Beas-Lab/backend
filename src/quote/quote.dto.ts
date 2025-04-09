import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuoteDto {
  @ApiProperty({ description: 'The amount for the quote' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Currency type for the source' })
  @IsString()
  @IsNotEmpty()
  sourceCurrency: string;

  @ApiProperty({ description: 'Currency type for the destination' })
  @IsString()
  @IsNotEmpty()
  destinationCurrency: string;

  @ApiProperty({ description: 'Account ID associated with the destination' })
  @IsString()
  @IsNotEmpty()
  destinationAccountId: string;

 
  constructor() {
    this.amount = 0; // default value
    this.sourceCurrency = ''; // default value
    this.destinationCurrency = ''; // default value
    this.destinationAccountId = ''; // default value
   }
}
