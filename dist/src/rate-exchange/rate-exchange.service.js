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
exports.ExchangeRateService = void 0;
// exchange-rate.service.ts
const common_1 = require("@nestjs/common");
const external_api_service_1 = require("../external-api/external-api.service");
let ExchangeRateService = class ExchangeRateService {
    constructor(externalApiService) {
        this.externalApiService = externalApiService;
    }
    async getExchangeRate(sourceCurrency, destinationCurrency) {
        try {
            return await this.externalApiService.getExchangeRate(sourceCurrency, destinationCurrency);
        }
        catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        throw new common_1.HttpException('Bad Request – Invalid currency code or missing parameters', common_1.HttpStatus.BAD_REQUEST);
                    case 404:
                        throw new common_1.HttpException('Exchange rate not found', common_1.HttpStatus.NOT_FOUND);
                    default:
                        throw new common_1.HttpException(error.response.data?.message || 'Internal Server Error', error.response.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            else {
                throw new common_1.HttpException('Failed to fetch exchange rate', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.ExchangeRateService = ExchangeRateService;
exports.ExchangeRateService = ExchangeRateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [external_api_service_1.ExternalApiService])
], ExchangeRateService);
