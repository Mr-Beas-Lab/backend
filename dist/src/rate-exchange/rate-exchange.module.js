"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateExchangeModule = void 0;
const common_1 = require("@nestjs/common");
const rate_exchange_controller_1 = require("./rate-exchange.controller");
const rate_exchange_service_1 = require("./rate-exchange.service");
const external_api_service_1 = require("../external-api/external-api.service");
let RateExchangeModule = class RateExchangeModule {
};
exports.RateExchangeModule = RateExchangeModule;
exports.RateExchangeModule = RateExchangeModule = __decorate([
    (0, common_1.Module)({
        controllers: [rate_exchange_controller_1.RateExchangeController],
        providers: [rate_exchange_service_1.ExchangeRateService, external_api_service_1.ExternalApiService]
    })
], RateExchangeModule);
