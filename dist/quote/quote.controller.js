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
exports.QuoteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const quote_dto_1 = require("./quote.dto");
const quote_service_1 = require("./quote.service");
let QuoteController = class QuoteController {
    constructor(quoteService) {
        this.quoteService = quoteService;
    }
    async createQuote(customerId, createQuoteDto) {
        return this.quoteService.createQuote(customerId, createQuoteDto);
    }
    async payQuote(customerId, quoteId, amount) {
        return this.quoteService.payQuote(customerId, quoteId, amount);
    }
};
exports.QuoteController = QuoteController;
__decorate([
    (0, common_1.Post)(':customerId/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new quote', description: 'Generates a quote based on the provided details.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Quote created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quote_dto_1.CreateQuoteDto]),
    __metadata("design:returntype", Promise)
], QuoteController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Post)(':customerId/:quoteId/pay/:amount'),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm and pay a quote',
        description: 'Executes payment for a previously created quote.'
    }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'ID of the customer making the payment' }),
    (0, swagger_1.ApiParam)({ name: 'quoteId', description: 'ID of the quote to pay' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payment processed successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid quote or payment data'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Quote not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Payment processing failed'
    }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Param)('quoteId')),
    __param(2, (0, common_1.Param)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], QuoteController.prototype, "payQuote", null);
exports.QuoteController = QuoteController = __decorate([
    (0, swagger_1.ApiTags)('quotes'),
    (0, common_1.Controller)('quote'),
    __metadata("design:paramtypes", [quote_service_1.QuoteService])
], QuoteController);
