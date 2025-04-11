import { IsString, IsNotEmpty, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentMethodDetailsDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  bankName!: string;

  @IsString()
  @IsNotEmpty()
  accountNumber!: string;
}

export class PaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['bank', 'mobile_money', 'crypto'], {
    message: 'Payment method type must be either bank, mobile_money, or crypto'
  })
  type!: string;

  @ValidateNested()
  @Type(() => PaymentMethodDetailsDto)
  details!: PaymentMethodDetailsDto;
}

export class AmbassadorInfoDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  tgUsername!: string;
}

export class JsonDataDto {
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod!: PaymentMethodDto;

  @ValidateNested()
  @Type(() => AmbassadorInfoDto)
  ambassador!: AmbassadorInfoDto;
}

export class DmDepositDetailsDto {
  @ValidateNested()
  @Type(() => JsonDataDto)
  jsonData!: JsonDataDto;

  @IsString()
  @IsNotEmpty()
  telegramId!: string;
}