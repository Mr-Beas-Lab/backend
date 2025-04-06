import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  addressLine1!: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  stateProvinceRegion!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsNotEmpty()
  postalCode!: string;

  constructor(partial: Partial<AddressDto> = {}) {
    Object.assign(this, partial);
  }
} 