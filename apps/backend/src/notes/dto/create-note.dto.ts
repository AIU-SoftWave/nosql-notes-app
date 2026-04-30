import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  tags?: string[];
}
