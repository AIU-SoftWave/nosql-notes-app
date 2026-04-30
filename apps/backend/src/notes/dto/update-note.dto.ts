import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  // All properties are optional and inherit Swagger decorators from CreateNoteDto
}
