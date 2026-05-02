export interface NoteListItem {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  views: number;
}

export interface NoteDetail {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface Comment {
  content: string;
  createdAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
  isPublic?: boolean;
  [key: string]: unknown;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  isPublic?: boolean;
  [key: string]: unknown;
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
  createdAt: string;
}

export type SortOption = 'newest' | 'oldest' | 'alpha' | 'views' | 'comments';

export type SortAlgorithm = 'merge' | 'quick' | 'bubble' | 'mongo';

export interface SortMetrics {
  algorithmId: string;
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  category: string;
}

export interface SortAlgorithmInfo {
  id: string;
  name: string;
  metrics: SortMetrics;
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