import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiPropertyOptional({ example: 'Updated title' })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated content' })
  content?: string;

  @ApiPropertyOptional({ type: [String], example: ['updated', 'tag'] })
  tags?: string[];

  @ApiPropertyOptional({ example: true })
  isPublic?: boolean;
}
