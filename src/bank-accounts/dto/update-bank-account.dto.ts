import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBankAccountDto {
  @IsString()
  @IsOptional()
  bank_code?: string;

  @IsString()
  @IsOptional()
  country_code?: string;

  @IsString()
  @IsOptional()
  beneficiary_name?: string;

  @IsString()
  @IsOptional()
  account_number?: string;

  @IsString()
  @IsOptional()
  id_doc_number?: string;

  @IsString()
  @IsOptional()
  account_type?: string;
} 