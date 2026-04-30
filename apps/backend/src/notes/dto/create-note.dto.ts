import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsTag } from '../decorators/istag.decorator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Meeting notes' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Capture the important points from the meeting.' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ type: [String], example: ['work', 'meeting'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsTag({ each: true })
  @ArrayMaxSize(10, { message: 'Maximum 10 tags allowed' })
  tags?: string[];
}
