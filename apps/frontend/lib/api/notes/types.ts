export interface NoteListItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  commentCount: number;
}

export interface NoteDetail {
  id: string;
  title: string;
  content: string;
  tags: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
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
