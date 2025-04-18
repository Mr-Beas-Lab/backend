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
exports.PayQuoteDto = exports.CreateQuoteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateQuoteDto {
    constructor() {
        this.amount = 0; // default value
        this.sourceCurrency = ''; // default value
        this.destinationCurrency = ''; // default value
        this.destinationAccountId = ''; // default value
    }
}
exports.CreateQuoteDto = CreateQuoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The amount for the quote' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateQuoteDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency type for the source' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "sourceCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency type for the destination' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "destinationCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account ID associated with the destination' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "destinationAccountId", void 0);
class PayQuoteDto {
    constructor() {
        this.confirmationMethod = '';
    }
}
exports.PayQuoteDto = PayQuoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment confirmation method', example: 'otp' }),
    __metadata("design:type", String)
], PayQuoteDto.prototype, "confirmationMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Confirmation code', required: false }),
    __metadata("design:type", String)
], PayQuoteDto.prototype, "confirmationCode", void 0);
