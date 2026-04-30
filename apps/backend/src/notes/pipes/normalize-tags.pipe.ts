import { PipeTransform, Injectable } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NormalizeTagsPipe implements PipeTransform {
  transform(value: CreateNoteDto | UpdateNoteDto) {
    if (value.tags && Array.isArray(value.tags)) {
      // Convert to lowercase and remove duplicates
      const normalized = Array.from(
        new Set(value.tags.map((tag) => tag.toLowerCase())),
      );
      value.tags = normalized;
    }
    return value;
  }
}
