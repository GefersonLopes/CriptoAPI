import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('validate')
  @UseInterceptors(FilesInterceptor('image'))
  async validateDocument(@UploadedFiles() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('You must upload image.');
    }

    const image = file[0];

    return this.documentService.validateDocument(image);
  }
}
