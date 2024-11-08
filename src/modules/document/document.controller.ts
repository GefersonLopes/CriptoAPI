import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { DocumentDTO } from './dto/document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('validate')
  @UseInterceptors(FilesInterceptor('image'))
  async validateDocument(
    @UploadedFiles() file: Express.Multer.File,
    @Body() document: DocumentDTO,
  ) {
    if (!file) {
      throw new BadRequestException('You must upload image.');
    }

    const image = file[0];

    return this.documentService.validateDocument({ image, ...document });
  }
}
