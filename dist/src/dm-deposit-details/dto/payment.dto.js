"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmDepositDetailsDto = exports.JsonDataDto = exports.AmbassadorInfoDto = exports.PaymentMethodDto = exports.PaymentMethodDetailsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PaymentMethodDetailsDto {
}
exports.PaymentMethodDetailsDto = PaymentMethodDetailsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentMethodDetailsDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentMethodDetailsDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentMethodDetailsDto.prototype, "accountNumber", void 0);
class PaymentMethodDto {
}
exports.PaymentMethodDto = PaymentMethodDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['bank', 'mobile_money', 'crypto'], {
        message: 'Payment method type must be either bank, mobile_money, or crypto'
    }),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentMethodDetailsDto),
    __metadata("design:type", PaymentMethodDetailsDto)
], PaymentMethodDto.prototype, "details", void 0);
class AmbassadorInfoDto {
}
exports.AmbassadorInfoDto = AmbassadorInfoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AmbassadorInfoDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AmbassadorInfoDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AmbassadorInfoDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AmbassadorInfoDto.prototype, "tgUsername", void 0);
class JsonDataDto {
}
exports.JsonDataDto = JsonDataDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentMethodDto),
    __metadata("design:type", PaymentMethodDto)
], JsonDataDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AmbassadorInfoDto),
    __metadata("design:type", AmbassadorInfoDto)
], JsonDataDto.prototype, "ambassador", void 0);
class DmDepositDetailsDto {
}
exports.DmDepositDetailsDto = DmDepositDetailsDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => JsonDataDto),
    __metadata("design:type", JsonDataDto)
], DmDepositDetailsDto.prototype, "jsonData", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DmDepositDetailsDto.prototype, "telegramId", void 0);
