import { api } from "../../api";
import { useQuery } from "@tanstack/react-query";
import {
  NoteListItem,
  NoteDetail,
  CreateNoteInput,
  UpdateNoteInput,
  DeleteNoteResult,
} from "./types";

export const notesApi = {
  getAll: () => api.get<NoteListItem[]>("/notes"),

  getById: (id: string) => api.get<NoteDetail>(`/notes/${id}`),

  create: (data: CreateNoteInput) => api.post<NoteDetail>("/notes", data),

  update: (id: string, data: UpdateNoteInput) =>
    api.put<NoteDetail>(`/notes/${id}`, data),

  delete: (id: string) => api.delete<DeleteNoteResult>(`/notes/${id}`),
};

// tanstack query hooks

const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: notesApi.getAll,
    select: (response) => response.data || [],
  });
};

export { useNotes };