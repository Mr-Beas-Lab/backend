import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  bank_code!: string;

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
  @IsNotEmpty()
  id_doc_number!: string;

  @IsString()
  @IsOptional()
  account_type?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;
} 