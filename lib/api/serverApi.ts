import axios from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

async function getApi(cookieHeader?: string) {
  let header = cookieHeader;
  if (!header) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    header = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  }

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
    headers: {
      Cookie: header,
    },
  });
}

export const checkSession = async (cookieHeader?: string) => {
  const serverApi = await getApi(cookieHeader);
  return await serverApi.get<User | null>("/auth/session");
};

export const getMe = async () => {
  const serverApi = await getApi();
  const { data } = await serverApi.get<User>("/users/me");
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
  const serverApi = await getApi();
  const params: Record<string, string | number> = { page, perPage };
  if (search.trim()) params.search = search.trim();
  if (tag) params.tag = tag;
  const { data } = await serverApi.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const serverApi = await getApi();
  const { data } = await serverApi.get<Note>(`/notes/${id}`);
  return data;
};
