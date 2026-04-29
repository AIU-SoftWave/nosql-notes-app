import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import {
  CreateCommentInput,
  CreateNoteInput,
  NoteRecord,
  NotesRepository,
  UpdateNoteInput,
} from './notes.types';
import { Note, NoteDocument } from './schemas/note.schema';

@Injectable()
export class NotesMongooseRepository implements NotesRepository {
  constructor(
    @InjectModel(Note.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(input: CreateNoteInput): Promise<NoteRecord> {
    const createdNote = new this.noteModel(input);
    const savedNote = await createdNote.save();
    return this.toRecord(savedNote);
  }

  async findAll(): Promise<NoteRecord[]> {
    const notes = await this.noteModel.find().sort({ createdAt: -1 }).exec();
    return notes.map((note) => this.toRecord(note));
  }

  async findById(id: string): Promise<NoteRecord | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const note = await this.noteModel.findById(id).exec();
    return note ? this.toRecord(note) : null;
  }

  async update(id: string, input: UpdateNoteInput): Promise<NoteRecord | null> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      return null;
    }

    if (input.title !== undefined) {
      note.title = input.title;
    }
    if (input.content !== undefined) {
      note.content = input.content;
    }
    if (input.tags !== undefined) {
      note.tags = [...input.tags];
    }

    const savedNote = await note.save();
    return this.toRecord(savedNote);
  }

  async remove(id: string): Promise<boolean> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      return false;
    }

    await note.deleteOne();
    return true;
  }

  async addComment(
    id: string,
    input: CreateCommentInput,
  ): Promise<NoteRecord | null> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      return null;
    }

    note.comments.push({ ...input, date: new Date() });
    const savedNote = await note.save();
    return this.toRecord(savedNote);
  }

  async incrementViews(id: string): Promise<NoteRecord | null> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      return null;
    }

    note.views += 1;
    const savedNote = await note.save();
    return this.toRecord(savedNote);
  }

  private toRecord(note: NoteDocument & { createdAt?: Date; updatedAt?: Date }) {
    return {
      _id: note._id.toString(),
      title: note.title,
      content: note.content,
      tags: [...note.tags],
      comments: note.comments.map((comment) => ({
        user: comment.user,
        text: comment.text,
        date: new Date(comment.date),
      })),
      views: note.views,
      createdAt: new Date(note.createdAt ?? new Date()),
      updatedAt: new Date(note.updatedAt ?? new Date()),
    } satisfies NoteRecord;
  }
}