import type { ObjectId } from 'mongodb';
import type { Comment } from '../entities/comment.entity';

export interface NoteListItem {
  id: ObjectId;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
}

export interface NoteDetail {
  id: ObjectId;
  title: string;
  content: string;
  tags: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteNoteResult {
  message: string;
}
