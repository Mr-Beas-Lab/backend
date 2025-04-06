import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ example: '123 Main St', description: 'Primary address line' })
  @IsString()
  @IsNotEmpty()
  addressLine1!: string;

  @ApiProperty({ example: 'Apt 4B', description: 'Secondary address line', required: false })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 'NY', description: 'State, province, or region' })
  @IsString()
  @IsNotEmpty()
  stateProvinceRegion!: string;

  @ApiProperty({ example: 'USA', description: 'Country name' })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({ example: '10001', description: 'Postal or ZIP code' })
  @IsString()
  @IsNotEmpty()
  postalCode!: string;

  constructor(partial: Partial<AddressDto> = {}) {
    Object.assign(this, partial);
  }
} 