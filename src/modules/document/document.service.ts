import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentService {
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!this.apiKey) {
      throw new Error(
        'Chave da API da OpenAI não definida nas variáveis de ambiente',
      );
    }
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  private readonly convertToBase64 = (
    filePath: string,
    mimeType: string,
  ): string => {
    const resolvedPath = path.resolve(filePath);
    const fileBuffer = fs.readFileSync(resolvedPath);
    const base64 = fileBuffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  };

  private readonly model = 'gpt-4o';
  private readonly client: OpenAI;

  private readonly openai = async (messages: any) =>
    this.client.chat.completions.create({
      model: this.model,
      temperature: 0.0,
      max_tokens: 100,
      messages,
    });

  async validateDocument(file: Express.Multer.File): Promise<any> {
    try {
      const base64Image = this.convertToBase64(file.path, file.mimetype);

      const response = await this.openai([
        {
          role: 'system',
          content:
            'Você é um fiscal de documentação. Retorne "true" se a imagem contiver um documento válido e o nome especificado.',
        },
        {
          role: 'user',
          content: `
            ${base64Image}
            Essa imagem é um documento de identidade brasileiro e contém o nome "Geferson Almeida Lopes" como do proprietário?
          `,
        },
      ]);

      const content = response.choices[0].message?.content.trim();
      console.log(content);
      return content === 'true';
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw new BadRequestException('Falha na validação.');
    } finally {
      await fs.promises.unlink(file.path);
    }
  }
}
