import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class DocumentDTO {
  @IsString()
  @IsNotEmpty()
  key_user: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  middle_name?: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  citizenship: string;

  @IsString()
  @IsNotEmpty()
  country_residency: string;

  @IsString()
  @IsNotEmpty()
  country_government_identify: string;

  @IsString()
  @IsNotEmpty()
  identify_type: string;

  image: Express.Multer.File;
}
