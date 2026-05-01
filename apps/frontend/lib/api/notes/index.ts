import { api } from "../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  NoteListItem,
  NoteDetail,
  CreateNoteInput,
  UpdateNoteInput,
  DeleteNoteResult,
  NoteStats,
  ActivityItem,
  SortOption,
} from "./types";

export const notesApi = {
  getAll: (tag?: string, search?: string, sort?: SortOption) => {
    const params = new URLSearchParams();
    if (tag) params.append("tag", tag);
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);
    const queryString = params.toString();
    return api.get<NoteListItem[]>(
      queryString ? `/notes?${queryString}` : "/notes",
    );
  },

  getById: (id: string) => api.get<NoteDetail>(`/notes/${id}`),

  create: (data: CreateNoteInput) => api.post<NoteDetail>("/notes", data),

  update: (id: string, data: UpdateNoteInput) =>
    api.put<NoteDetail>(`/notes/${id}`, data),

  delete: (id: string) => api.delete<DeleteNoteResult>(`/notes/${id}`),

  addComment: (id: string, content: string) =>
    api.post<Comment>(`/notes/${id}/comments`, { content }),

  getStats: () => api.get<NoteStats>("/notes/stats"),

  getActivity: (limit?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    const queryString = params.toString();
    return api.get<ActivityItem[]>(
      queryString ? `/notes/activity?${queryString}` : "/notes/activity",
    );
  },
};

// tanstack query hooks

export const useNotes = (tag?: string, search?: string, sort?: SortOption) => {
  return useQuery({
    queryKey: ["notes", tag, search, sort],
    queryFn: () => notesApi.getAll(tag, search, sort),
    select: (response) => response.data || [],
    retry: 2,
    staleTime: 1000 * 60 * 5,
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

export const useNoteStats = () => {
  return useQuery({
    queryKey: ["notes", "stats"],
    queryFn: () => notesApi.getStats(),
    select: (response) => response.data,
    staleTime: 1000 * 60,
  });
};

export const useNoteActivity = (limit?: number) => {
  return useQuery({
    queryKey: ["notes", "activity", limit],
    queryFn: () => notesApi.getActivity(limit),
    select: (response) => response.data || [],
    staleTime: 1000 * 60,
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

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      notesApi.addComment(id, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", variables.id] });
    },
  });
};

export * from "./types";