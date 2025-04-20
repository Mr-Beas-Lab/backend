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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const swagger_1 = require("@nestjs/swagger");
const bank_accounts_service_1 = require("../bank-accounts/bank-accounts.service");
const create_bank_account_dto_1 = require("../bank-accounts/dto/create-bank-account.dto");
let CustomersController = class CustomersController {
    constructor(customersService, bankAccountsService) {
        this.customersService = customersService;
        this.bankAccountsService = bankAccountsService;
    }
    create(createCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }
    findByTelegramId(telegramId) {
        return this.customersService.findByTelegramId(telegramId);
    }
    createBankAccount(customerId, createBankAccountDto) {
        return this.bankAccountsService.create(createBankAccountDto, customerId);
    }
    getCustomerBankAccounts(customerId) {
        return this.bankAccountsService.findByCustomerId(customerId);
    }
    deleteBankAccount(customerId, id) {
        return this.bankAccountsService.remove(id);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The customer has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('telegram/:telegramId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a customer by Telegram ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the customer.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found.' }),
    __param(0, (0, common_1.Param)('telegramId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "findByTelegramId", null);
__decorate([
    (0, common_1.Post)(':customerId/bank-accounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a bank account for a customer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The bank account has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found.' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_bank_account_dto_1.CreateBankAccountDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "createBankAccount", null);
__decorate([
    (0, common_1.Get)(':customerId/bank-accounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bank accounts for a customer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all bank accounts for the customer.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found.' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getCustomerBankAccounts", null);
__decorate([
    (0, common_1.Delete)(':customerId/bank-accounts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a bank account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The bank account has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bank account not found.' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "deleteBankAccount", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('customers'),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        bank_accounts_service_1.BankAccountsService])
], CustomersController);
