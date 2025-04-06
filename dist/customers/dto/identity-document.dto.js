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
exports.IdentityDocumentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class IdentityDocumentDto {
    constructor(partial = {}) {
        Object.assign(this, partial);
    }
}
exports.IdentityDocumentDto = IdentityDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USA', description: 'Country that issued the identity document' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IdentityDocumentDto.prototype, "idDocCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'passport',
        description: 'Type of identity document',
        enum: ['national_id', 'passport', 'driver_license']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['national_id', 'passport', 'driver_license']),
    __metadata("design:type", String)
], IdentityDocumentDto.prototype, "idDocType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AB123456', description: 'Identity document number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IdentityDocumentDto.prototype, "idDocNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Front of identity document file', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], IdentityDocumentDto.prototype, "idDocFrontFile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Back of identity document file', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], IdentityDocumentDto.prototype, "idDocBackFile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Front of identity document preview URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IdentityDocumentDto.prototype, "idDocFrontPreview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Back of identity document preview URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IdentityDocumentDto.prototype, "idDocBackPreview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Front of identity document URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IdentityDocumentDto.prototype, "idDocFrontUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Back of identity document URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IdentityDocumentDto.prototype, "idDocBackUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether front document is uploaded', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], IdentityDocumentDto.prototype, "idDocFrontUploaded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether back document is uploaded', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], IdentityDocumentDto.prototype, "idDocBackUploaded", void 0);
