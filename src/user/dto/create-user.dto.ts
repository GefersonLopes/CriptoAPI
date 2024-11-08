import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
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

  blob_document: Buffer;
}
