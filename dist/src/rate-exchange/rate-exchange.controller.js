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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateExchangeController = void 0;
// exchange-rate.controller.ts
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rate_exchange_service_1 = require("./rate-exchange.service");
const rate_exchange_dto_1 = require("./rate-exchange.dto");
let RateExchangeController = class RateExchangeController {
    constructor(exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }
    async getExchangeRate(query) {
        return this.exchangeRateService.getExchangeRate(query.source_currency, query.destination_currency);
    }
};
exports.RateExchangeController = RateExchangeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get exchange rate between two currencies' }),
    (0, swagger_1.ApiQuery)({ name: 'source_currency', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'destination_currency', required: true, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exchange rate retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid currency parameters' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exchange rate not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to fetch exchange rate' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rate_exchange_dto_1.GetRateDto]),
    __metadata("design:returntype", Promise)
], RateExchangeController.prototype, "getExchangeRate", null);
exports.RateExchangeController = RateExchangeController = __decorate([
    (0, swagger_1.ApiTags)('exchange-rates'),
    (0, common_1.Controller)('exchange-rates'),
    __metadata("design:paramtypes", [rate_exchange_service_1.ExchangeRateService])
], RateExchangeController);
