import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsTag } from '../decorators/istag.decorator';

// Sanitization function to remove potentially dangerous HTML/script content
function sanitizeInput(value: string): string {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

export class CreateNoteDto {
  @ApiProperty({ example: 'Meeting notes', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) => sanitizeInput(value))
  title!: string;

  @ApiProperty({
    example: 'Capture the important points from the meeting.',
    maxLength: 50000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50000, { message: 'Content must not exceed 50000 characters' })
  @Transform(({ value }: { value: string }) => sanitizeInput(value))
  content!: string;

  @ApiPropertyOptional({ type: [String], example: ['work', 'meeting'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsTag({ each: true })
  @ArrayMaxSize(10, { message: 'Maximum 10 tags allowed' })
  @Transform(({ value }: { value: string[] }) =>
    Array.isArray(value)
      ? value.map((tag: string) =>
          sanitizeInput(tag)
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, ''),
        )
      : value,
  )
  tags?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
