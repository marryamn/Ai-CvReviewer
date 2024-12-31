import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Express, Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import 'multer'; // This import makes Multer available in the Express namespace
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {UploadFileRequest} from "./UploadFile.model";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @ts-ignore
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileRequest,
    description: 'Either send an avatarId or upload a file',
  })
  async uploadCV(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // We forward the file to the service to parse and analyze it
    return this.appService.processCVFile(file);
  }
}
