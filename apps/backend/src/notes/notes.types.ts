import type { Comment } from '../entities/comment.entity';

export interface NoteListItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
}

export interface NoteDetail {
  id: string;
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
