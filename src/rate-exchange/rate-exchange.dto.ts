import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetRateDto {
  @ApiProperty({
    description: 'Source currency code (e.g. USDC)',
    example: 'USDC',
  })
  @IsString()
  @IsNotEmpty()
  source_currency: string;

  @ApiProperty({
    description: 'Destination currency code (e.g. VES)',
    example: 'VES',
  })
  @IsString()
  @IsNotEmpty()
  destination_currency: string;

  constructor() {
    this.source_currency = ''; 
    this.destination_currency = '';  
   }
}