import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DmDepositDetailsDto } from './dto/payment.dto';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

interface TelegramResponse {
  ok: boolean;
  result: any;
}

@Injectable()
export class DmDepositDetailsService {
  private readonly botToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '7504377230:AAF5T7Yu3Marxe2f-KudsOQ4ot_O_zQeiiA';
  }

  private encodeBase64URL(data: string): string {
    return Buffer.from(data)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private escapeMarkdown(text: string): string {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  }

  async processDepositDetails(data: DmDepositDetailsDto) {
    try {
      if (!data.jsonData || !data.telegramId) {
        throw new BadRequestException('Missing required fields');
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

      const response = await lastValueFrom<AxiosResponse<TelegramResponse>>(
        this.httpService.post(
          `https://api.telegram.org/bot${this.botToken}/sendMessage`,
          {
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
          }
        )
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error: unknown) {
      console.error('Error processing deposit details:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(errorMessage);
    }
  }
}