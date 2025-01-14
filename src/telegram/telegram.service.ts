import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { TEST_USER } from './telegram.constant';
import axios from 'axios';
import { createWriteStream } from 'fs';
import * as path from 'path';
const TELEGRAM_TOKEN = '7388703557:AAEEngXGhabenHjFjlY8vptfJRQairUVes4';
@Injectable()
export class TelegramService {
  private readonly bot: TelegramBot;
  private logger = new Logger(TelegramService.name);

  constructor() {
    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
   // this.bot.on('message', this.onReceiveMessage);
    this.onSendMessage(TEST_USER, 'server started');
    this.bot.on('document', async (msg) => {
      // `msg.document` holds info about the uploaded file
      await this.handleDocument(msg);
    });
  }

  onReceiveMessage = (msg: any) => {
    this.logger.debug(msg);
  };

  onSendMessage = (userId: string, message: string) => {
    this.bot.sendMessage(userId, message);
  };

  private async handleDocument(msg: TelegramBot.Message): Promise<void> {
    const document = msg.document;
    if (!document) return;

    // 1. Get file ID from the document
    const fileId = document.file_id;

    // 2. Request Telegram for file info (which gives us the file path)
    const fileInfo = await this.bot.getFile(fileId);
    const filePath = fileInfo.file_path; // e.g. "documents/file_123.pdf"

    // 3. Construct the download URL
    const downloadUrl = `https://api.telegram.org/file/bot${this.bot.token}/${filePath}`;

    // 4. Download and save the file
    await this.downloadFile(downloadUrl, document.file_name);

    this.logger.log(`File '${document.file_name}' downloaded successfully!`);
  }

  /**
   * Download a file from the given URL and save it locally
   */
  private async downloadFile(downloadUrl: string, fileName?: string) {
    // You can choose any local path. Using "uploads" folder here as an example.
    // In real projects, ensure the folder exists or handle errors accordingly.
    const savePath = path.join(__dirname, '..', 'uploads', fileName ?? 'file');

    // Make a GET request for the file, expecting a stream as response
    const response = await axios.get<ReadableStream>(downloadUrl, {
      responseType: 'stream',
    });

    // Pipe the response data (file stream) into a local file
    const writer = createWriteStream(savePath);

    // Promisify the stream end
    return new Promise<void>((resolve, reject) => {
      response.data.pipe(writer);

      writer.on('finish', () => {
        this.logger.log(`Saved file to ${savePath}`);
        resolve();
      });

      writer.on('error', (err) => {
        this.logger.error(`Failed to write file: ${err.message}`);
        reject(err);
      });
    });
  }
}
