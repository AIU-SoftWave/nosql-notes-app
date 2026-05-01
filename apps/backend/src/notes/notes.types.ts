import type { Comment } from '../entities/comment.entity';

export interface NoteListItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  views: number;
}

export interface NoteDetail {
  id: string;
  title: string;
  content: string;
  tags: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

export interface DeleteNoteResult {
  message: string;
}

export interface NoteStats {
  totalNotes: number;
  totalComments: number;
  totalViews: number;
  tags: { tag: string; count: number }[];
}

export interface ActivityItem {
  type: 'note' | 'comment';
  noteId: string;
  title: string;
  createdAt: Date;
}
