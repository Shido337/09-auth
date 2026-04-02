import { apiClient } from './client';
import type { Note, NoteDraft, NoteTag } from '@/types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search = '',
  page = 1,
  perPage = 12,
  tag?: NoteTag
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (tag) {
    params.tag = tag;
  }

  const { data } = await apiClient.get<FetchNotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await apiClient.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (noteData: NoteDraft): Promise<Note> => {
  const { data } = await apiClient.post<Note>('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await apiClient.delete<Note>(`/notes/${id}`);
  return data;
};
