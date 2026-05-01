import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllNotesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['newest', 'oldest', 'alpha'], default: 'newest' })
  @IsOptional()
  @IsString()
  sort?: 'newest' | 'oldest' | 'alpha';
}
