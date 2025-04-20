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
exports.DmDepositDetailsController = void 0;
const common_1 = require("@nestjs/common");
const dm_deposit_details_service_1 = require("./dm-deposit-details.service");
const payment_dto_1 = require("./dto/payment.dto");
const swagger_1 = require("@nestjs/swagger");
let DmDepositDetailsController = class DmDepositDetailsController {
    constructor(dmDepositDetailsService) {
        this.dmDepositDetailsService = dmDepositDetailsService;
    }
    async processDepositDetails(data) {
        return this.dmDepositDetailsService.processDepositDetails(data);
    }
};
exports.DmDepositDetailsController = DmDepositDetailsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Process DM deposit details and send Telegram message' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully processed deposit details' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Missing required fields' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.DmDepositDetailsDto]),
    __metadata("design:returntype", Promise)
], DmDepositDetailsController.prototype, "processDepositDetails", null);
exports.DmDepositDetailsController = DmDepositDetailsController = __decorate([
    (0, swagger_1.ApiTags)('direct message deposit details'),
    (0, common_1.Controller)('dm-deposit-details'),
    __metadata("design:paramtypes", [dm_deposit_details_service_1.DmDepositDetailsService])
], DmDepositDetailsController);
