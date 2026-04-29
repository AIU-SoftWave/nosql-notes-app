export interface NoteComment {
  user: string;
  text: string;
  date: Date;
}

export interface NoteRecord {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  comments: NoteComment[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface CreateCommentInput {
  user: string;
  text: string;
}

export interface NotesRepository {
  create(input: CreateNoteInput): Promise<NoteRecord>;
  findAll(): Promise<NoteRecord[]>;
  findById(id: string): Promise<NoteRecord | null>;
  update(id: string, input: UpdateNoteInput): Promise<NoteRecord | null>;
  remove(id: string): Promise<boolean>;
  addComment(id: string, input: CreateCommentInput): Promise<NoteRecord | null>;
  incrementViews(id: string): Promise<NoteRecord | null>;
}