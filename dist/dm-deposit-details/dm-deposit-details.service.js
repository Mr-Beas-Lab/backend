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
exports.DmDepositDetailsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let DmDepositDetailsService = class DmDepositDetailsService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || '7504377230:AAF5T7Yu3Marxe2f-KudsOQ4ot_O_zQeiiA';
    }
    encodeBase64URL(data) {
        return Buffer.from(data)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
    escapeMarkdown(text) {
        return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
    }
    async processDepositDetails(data) {
        try {
            if (!data.jsonData || !data.telegramId) {
                throw new common_1.BadRequestException('Missing required fields');
            }
            const { jsonData, telegramId } = data;
            const { paymentMethod, ambassador } = jsonData;
            // Escape all user-provided text for Markdown
            const escapedFirstName = this.escapeMarkdown(ambassador.firstName);
            const escapedLastName = this.escapeMarkdown(ambassador.lastName);
            const escapedTgUsername = this.escapeMarkdown(ambassador.tgUsername.replace('@', ''));
            const escapedBankName = this.escapeMarkdown(paymentMethod.details.bankName);
            const escapedAccountNumber = this.escapeMarkdown(paymentMethod.details.accountNumber);
            const receiptData = JSON.stringify({
                ambassador: {
                    id: ambassador.id,
                    name: `${ambassador.firstName} ${ambassador.lastName}`,
                    username: ambassador.tgUsername
                },
                payment: {
                    bank: paymentMethod.details.bankName,
                    account: paymentMethod.details.accountNumber,
                    type: paymentMethod.type
                },
                timestamp: Date.now()
            });
            const encodedData = this.encodeBase64URL(receiptData);
            const miniAppUrl = `https://t.me/mrbeasapp_bot/app?startapp=${encodedData}`;
            const message = [
                '💰 *Payment Details P2P trusted wallet*',
                '',
                '💰 *Deposit to*',
                '',
                `*Name*: ${escapedFirstName} ${escapedLastName}`,
                `*Telegram Username*: @${escapedTgUsername}`,
                `*Bank Name*: ${escapedBankName}`,
                `*Account Number*: ${escapedAccountNumber}`
            ].join('\n');
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                chat_id: telegramId,
                text: message,
                parse_mode: 'MarkdownV2',
                reply_markup: {
                    inline_keyboard: [[
                            {
                                text: '📤 Upload Receipt',
                                url: miniAppUrl
                            }
                        ]]
                }
            }));
            return {
                success: true,
                data: response.data
            };
        }
        catch (error) {
            console.error('Error processing deposit details:', error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Internal server error';
            throw new common_1.InternalServerErrorException(errorMessage);
        }
    }
};
exports.DmDepositDetailsService = DmDepositDetailsService;
exports.DmDepositDetailsService = DmDepositDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], DmDepositDetailsService);
