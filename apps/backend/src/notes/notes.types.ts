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

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PerformanceMetrics {
  algorithmId: string;
  algorithmName: string;
  executionTimeMs: number;
  dataSize: number;
  timeComplexity: string;
  spaceComplexity: string;
  stable: boolean;
}

export interface NotesResponse {
  data: NoteListItem[];
  pagination: PaginationInfo;
  performance: PerformanceMetrics;
}