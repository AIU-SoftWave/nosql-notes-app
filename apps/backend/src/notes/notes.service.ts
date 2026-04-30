import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import type { DeleteNoteResult, NoteListItem } from './notes.types';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.notesRepository.create({
      title: createNoteDto.title,
      content: createNoteDto.content,
      tags: createNoteDto.tags ?? [],
      comments: [],
    });

    return this.notesRepository.save(note);
  }

  async findAll(): Promise<NoteListItem[]> {
    const notes = await this.notesRepository.find({
      order: { createdAt: 'DESC' },
    });

    return notes.map(({ comments, ...note }) => ({
      ...note,
      commentCount: comments?.length ?? 0,
    }));
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.findNoteById(id);

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findNoteById(id);

    if (updateNoteDto.title !== undefined) {
      note.title = updateNoteDto.title;
    }

    if (updateNoteDto.content !== undefined) {
      note.content = updateNoteDto.content;
    }

    if (updateNoteDto.tags !== undefined) {
      note.tags = updateNoteDto.tags;
    }

    return this.notesRepository.save(note);
  }

  async delete(id: string): Promise<DeleteNoteResult> {
    const note = await this.findNoteById(id);
    await this.notesRepository.delete(note.id);

    return {
      message: 'Note deleted successfully',
    };
  }

  private async findNoteById(id: string): Promise<Note> {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException('Note not found');
    }

    const note = await this.notesRepository.findOne({
      where: { id: new ObjectId(id) },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }
}
