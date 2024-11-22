import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { DocumentDTO } from './dto/document.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DocumentService {
  private readonly apiKey: string;
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!this.apiKey) {
      throw new Error(
        'Chave da API da OpenAI não definida nas variáveis de ambiente',
      );
    }
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  private readonly convertToBase64 = async (
    filePath: string,
  ): Promise<string> => {
    const resolvedPath = path.resolve(filePath);

    const buffer = await sharp(resolvedPath)
      .jpeg({ quality: 50 })
      .png({ quality: 50 })
      .toBuffer();

    return buffer.toString('base64');
  };

  private readonly convertToBlob = async (filePath: string) =>
    await sharp(filePath).toBuffer();

  private readonly model = 'gpt-4o';
  private readonly client: OpenAI;

  private readonly openai = async (messages: any) =>
    this.client.chat.completions.create({
      model: this.model,
      temperature: 0.0,
      messages,
    });

  private readonly updateUser = async (
    key_user: string,
    documentDTO: DocumentDTO,
    blob_document: Buffer,
  ) =>
    await this.userService.update(key_user, {
      first_name: documentDTO.first_name,
      middle_name: documentDTO.middle_name,
      last_name: documentDTO.last_name,
      citizenship: documentDTO.citizenship,
      country_residency: documentDTO.country_residency,
      country_government_identify: documentDTO.country_government_identify,
      blob_document,
    });

  async validateDocument(documentDTO: DocumentDTO): Promise<any> {
    const {
      image,
      key_user,
      first_name,
      middle_name,
      last_name,
      country_government_identify,
      identify_type,
    } = documentDTO;

    try {
      const base64Image = await this.convertToBase64(image.path);

      const responseGPTo = await this.openai([
        {
          role: 'system',
          content: `You are a watchdog of ${identify_type}.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `This image is a document of ${identify_type} of ${country_government_identify} and contains the name "${first_name + ' ' + middle_name ? middle_name + ' ' : '' + last_name}" as the owner's? Return “true” if the image contains a valid document and the specified name.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${image.mimetype};base64,${base64Image}`,
              },
            },
          ],
        },
      ]);

      const content = responseGPTo.choices[0].message?.content
        .trim()
        .toLocaleLowerCase();

      this.logger.log(content);
      const valid = ['true'].includes(content);

      if (!valid) {
        throw new BadRequestException('Falha na validação.');
      }

      const blob = await this.convertToBlob(image.path);

      return this.updateUser(key_user, documentDTO, blob);
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw new BadRequestException('Falha na validação.');
    } finally {
      await fs.promises.unlink(image.path);
    }
  }
}
