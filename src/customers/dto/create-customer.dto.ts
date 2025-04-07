import { IsString, IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer legal name' })
  @IsString()
  @IsNotEmpty()
  legal_name!: string;

  @ApiProperty({ description: 'Customer email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Customer phone number' })
  @IsString()
  @IsNotEmpty()
  phone_number!: string;

  @ApiProperty({ description: 'Customer type', enum: ['individual', 'business'] })
  @IsString()
  @IsIn(['individual', 'business'])
  @IsNotEmpty()
  type!: 'individual' | 'business';

  @ApiProperty({ description: 'Customer Telegram ID' })
  @IsString()
  @IsNotEmpty()
  telegram_id!: string;
}