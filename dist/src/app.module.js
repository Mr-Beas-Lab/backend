"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const firebase_module_1 = require("./firebase/firebase.module");
const customers_module_1 = require("./customers/customers.module");
const external_api_module_1 = require("./external-api/external-api.module");
const bank_accounts_module_1 = require("./bank-accounts/bank-accounts.module");
const quotenest_service_1 = require("./generate/quotenest/quotenest.service");
const quote_module_1 = require("./quote/quote.module");
const dm_deposit_details_module_1 = require("./dm-deposit-details/dm-deposit-details.module");
const rate_exchange_module_1 = require("./rate-exchange/rate-exchange.module");
const health_controller_1 = require("./health/health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            firebase_module_1.FirebaseModule,
            customers_module_1.CustomersModule,
            external_api_module_1.ExternalApiModule,
            bank_accounts_module_1.BankAccountsModule,
            quote_module_1.QuoteModule,
            dm_deposit_details_module_1.DmDepositDetailsModule,
            rate_exchange_module_1.RateExchangeModule,
        ],
        providers: [quotenest_service_1.QuotenestService],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
