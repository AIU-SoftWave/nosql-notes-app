import { api } from "../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: notesApi.getAll,
    select: (response) => response.data || [],
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: () => notesApi.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteInput }) =>
      notesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", variables.id] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export * from "./types";
