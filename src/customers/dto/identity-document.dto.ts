import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class IdentityDocumentDto {
  @IsString()
  @IsNotEmpty()
  idDocCountry!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['national_id', 'passport', 'driver_license'])
  idDocType!: string;

  @IsString()
  @IsNotEmpty()
  idDocNumber!: string;

  constructor(partial: Partial<IdentityDocumentDto> = {}) {
    Object.assign(this, partial);
  }
}