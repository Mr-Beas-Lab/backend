import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { IdentityDocumentDto } from './identity-document.dto';

export class CreateCustomerDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone_number!: string;

  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdentityDocumentDto)
  identityDocument!: IdentityDocumentDto;

  constructor(partial: Partial<CreateCustomerDto> = {}) {
    Object.assign(this, partial);
  }
}