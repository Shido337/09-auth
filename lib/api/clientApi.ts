import { api } from "./api";
import type { User } from "@/types/user";
import type { Note, NoteDraft } from "@/types/note";

export const register = async (email: string, password: string) => {
  const { data } = await api.post<User>("/auth/register", { email, password });
  return data;
};

export const login = async (email: string, password: string) => {
  const { data } = await api.post<User>("/auth/login", { email, password });
  return data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<{ success: boolean }> => {
  const { data } = await api.get<{ success: boolean }>("/auth/session");
  return data;
};

export const getMe = async () => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (username: string) => {
  const { data } = await api.patch<User>("/users/me", { username });
  return data;
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search = "",
  page = 1,
  perPage = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search.trim()) params.search = search.trim();
  if (tag) params.tag = tag;
  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: NoteDraft) => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
