import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NOTES_REPOSITORY } from './notes.constants';
import {
  CreateCommentInput,
  CreateNoteInput,
  UpdateNoteInput,
} from './notes.types';

import { Inject } from '@nestjs/common';
import type { NotesRepository } from './notes.types';

@Injectable()
export class NotesService {
  constructor(
    @Inject(NOTES_REPOSITORY)
    private readonly notesRepository: NotesRepository,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    return this.notesRepository.create(createNoteDto as CreateNoteInput);
  }

  async findAll() {
    return this.notesRepository.findAll();
  }

  async findOne(id: string) {
    return this.findByIdOrThrow(id);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    return this.notesRepository.update(id, updateNoteDto as UpdateNoteInput);
  }

  async remove(id: string) {
    const deleted = await this.notesRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException('Note not found');
    }

    return { deleted: true };
  }

  async addComment(id: string, createCommentDto: CreateCommentDto) {
    return this.findByIdOrThrow(id, createCommentDto as CreateCommentInput);
  }

  async incrementViews(id: string) {
    const note = await this.notesRepository.incrementViews(id);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  private async findByIdOrThrow(
    id: string,
    commentToAdd?: CreateCommentInput,
  ) {
    if (commentToAdd) {
      const note = await this.notesRepository.addComment(id, commentToAdd);
      if (!note) {
        throw new NotFoundException('Note not found');
      }

      return note;
    }

    const note = await this.notesRepository.findById(id);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  private async validateIdOrThrow(id: string) {
    if (id.trim().length === 0) {
      throw new BadRequestException('Invalid note id');
    }
  }
}