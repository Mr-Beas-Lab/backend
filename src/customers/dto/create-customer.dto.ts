import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested, IsDateString, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { IdentityDocumentDto } from './identity-document.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+251912345678' })
  @IsString()
  phone_number!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  first_name!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  last_name!: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty()
  address: any;

  @ApiProperty()
  identityDocument: any;

  @ApiProperty({ example: '192.168.1.1', required: false })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsString()
  @IsOptional()
  telegramId?: string;

  constructor(partial: Partial<CreateCustomerDto> = {}) {
    Object.assign(this, partial);
  }
}