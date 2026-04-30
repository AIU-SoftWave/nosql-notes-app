import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from '../entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import type { DeleteNoteResult, NoteDetail, NoteListItem } from './notes.types';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name)
    private readonly notesModel: Model<NoteDocument>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<NoteDetail> {
    const note = await this.notesModel.create({
      title: createNoteDto.title,
      content: createNoteDto.content,
      tags: createNoteDto.tags ?? [],
      comments: [],
    });

    return this.toNoteDetail(note);
  }

  async findAll(): Promise<NoteListItem[]> {
    const notes = await this.notesModel.find().sort({ createdAt: -1 }).exec();

    return notes.map((note) => this.toNoteListItem(note));
  }

  async findOne(id: string): Promise<NoteDetail> {
    const note = await this.findNoteById(id);

    return this.toNoteDetail(note);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<NoteDetail> {
    await this.findNoteById(id);

    const updated = await this.notesModel
      .findByIdAndUpdate(
        id,
        {
          ...(updateNoteDto.title !== undefined ? { title: updateNoteDto.title } : {}),
          ...(updateNoteDto.content !== undefined ? { content: updateNoteDto.content } : {}),
          ...(updateNoteDto.tags !== undefined ? { tags: updateNoteDto.tags } : {}),
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return this.toNoteDetail(updated);
  }

  async delete(id: string): Promise<DeleteNoteResult> {
    const note = await this.findNoteById(id);
    await this.notesModel.findByIdAndDelete(note._id.toString()).exec();

    return {
      message: 'Note deleted successfully',
    };
  }

  private async findNoteById(id: string): Promise<NoteDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Note not found');
    }

    const note = await this.notesModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  private toNoteListItem(note: NoteDocument): NoteListItem {
    const plain = note.toObject();

    return {
      id: plain._id.toString(),
      title: plain.title,
      content: plain.content,
      tags: plain.tags ?? [],
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
      commentCount: plain.comments?.length ?? 0,
    };
  }

  private toNoteDetail(note: NoteDocument): NoteDetail {
    const plain = note.toObject();

    return {
      id: plain._id.toString(),
      title: plain.title,
      content: plain.content,
      tags: plain.tags ?? [],
      comments: plain.comments ?? [],
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
