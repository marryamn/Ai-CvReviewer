import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
const TELEGRAM_TOKEN = '7388703557:AAEEngXGhabenHjFjlY8vptfJRQairUVes4';
@Injectable()
export class TelegramService {
  private readonly bot: TelegramBot;
  private logger = new Logger(TelegramService.name);

  constructor() {
    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    this.bot.on('message', this.onReceiveMessage);
  }

  onReceiveMessage = (msg: any) => {
    this.logger.debug(msg);
  };
}
