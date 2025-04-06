import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdentityDocumentDto {
  @ApiProperty({ example: 'USA', description: 'Country that issued the identity document' })
  @IsString()
  @IsNotEmpty()
  idDocCountry!: string;

  @ApiProperty({ 
    example: 'passport', 
    description: 'Type of identity document',
    enum: ['national_id', 'passport', 'driver_license']
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['national_id', 'passport', 'driver_license'])
  idDocType!: string;

  @ApiProperty({ example: 'AB123456', description: 'Identity document number' })
  @IsString()
  @IsNotEmpty()
  idDocNumber!: string;

  @ApiProperty({ description: 'Front of identity document file', required: false })
  @IsOptional()
  idDocFrontFile?: Express.Multer.File;

  @ApiProperty({ description: 'Back of identity document file', required: false })
  @IsOptional()
  idDocBackFile?: Express.Multer.File;

  @ApiProperty({ description: 'Front of identity document preview URL', required: false })
  @IsString()
  @IsOptional()
  idDocFrontPreview?: string;

  @ApiProperty({ description: 'Back of identity document preview URL', required: false })
  @IsString()
  @IsOptional()
  idDocBackPreview?: string;

  @ApiProperty({ description: 'Front of identity document URL', required: false })
  @IsString()
  @IsOptional()
  idDocFrontUrl?: string;

  @ApiProperty({ description: 'Back of identity document URL', required: false })
  @IsString()
  @IsOptional()
  idDocBackUrl?: string;

  @ApiProperty({ description: 'Whether front document is uploaded', required: false })
  @IsOptional()
  idDocFrontUploaded?: boolean;

  @ApiProperty({ description: 'Whether back document is uploaded', required: false })
  @IsOptional()
  idDocBackUploaded?: boolean;

  constructor(partial: Partial<IdentityDocumentDto> = {}) {
    Object.assign(this, partial);
  }
}