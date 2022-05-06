import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmpty } from 'class-validator';

export class UploadFileDto {
  @IsString({ message: 'The image must be a text string.' })
  @IsEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    format: 'binary',
    type: 'string',
  })
  file_image: string;
}
