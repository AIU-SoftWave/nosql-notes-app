export interface NoteListItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  views: number;
}

export interface NoteDetail {
  id: string;
  title: string;
  content: string;
  tags: string[];
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
  [key: string]: unknown;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
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

export type SortOption = 'newest' | 'oldest' | 'alpha';