import { Injectable } from '@nestjs/common';
import {
  CreateCommentInput,
  CreateNoteInput,
  NoteRecord,
  NotesRepository,
  UpdateNoteInput,
} from './notes.types';

@Injectable()
export class NotesMemoryRepository implements NotesRepository {
  private readonly notes = new Map<string, NoteRecord>();

  async create(input: CreateNoteInput): Promise<NoteRecord> {
    const now = new Date();
    const note: NoteRecord = {
      _id: crypto.randomUUID(),
      title: input.title,
      content: input.content,
      tags: [...input.tags],
      comments: [],
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.notes.set(note._id, note);
    return this.clone(note);
  }

  async findAll(): Promise<NoteRecord[]> {
    return [...this.notes.values()]
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .map((note) => this.clone(note));
  }

  async findById(id: string): Promise<NoteRecord | null> {
    const note = this.notes.get(id);
    return note ? this.clone(note) : null;
  }

  async update(id: string, input: UpdateNoteInput): Promise<NoteRecord | null> {
    const note = this.notes.get(id);
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

    note.updatedAt = new Date();
    this.notes.set(id, note);
    return this.clone(note);
  }

  async remove(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  async addComment(
    id: string,
    input: CreateCommentInput,
  ): Promise<NoteRecord | null> {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    note.comments.push({
      user: input.user,
      text: input.text,
      date: new Date(),
    });
    note.updatedAt = new Date();
    this.notes.set(id, note);
    return this.clone(note);
  }

  async incrementViews(id: string): Promise<NoteRecord | null> {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    note.views += 1;
    note.updatedAt = new Date();
    this.notes.set(id, note);
    return this.clone(note);
  }

  private clone(note: NoteRecord): NoteRecord {
    return {
      ...note,
      tags: [...note.tags],
      comments: note.comments.map((comment) => ({ ...comment })),
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    };
  }
}