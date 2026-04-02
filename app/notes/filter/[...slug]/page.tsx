import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api/serverApi';
import { noteTags, type NoteTag } from '@/types/note';

const noteFilterBaseUrl = 'https://notehub.vercel.app/notes/filter';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawTag = slug?.[0];
  const selectedTag =
    !rawTag || rawTag === 'all' || !noteTags.includes(rawTag as NoteTag) ? 'all' : rawTag;

  const title = `Notes by filter: ${selectedTag} | NoteHub`;
  const description = `Browse NoteHub notes with the \"${selectedTag}\" filter.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/notes/filter/${selectedTag}`,
    },
    openGraph: {
      title,
      description,
      url: `${noteFilterBaseUrl}/${selectedTag}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;

  if (slug && slug.length > 1) {
    notFound();
  }

  const rawTag = slug?.[0];

  let tag: NoteTag | undefined;

  if (!rawTag || rawTag === 'all') {
    tag = undefined;
  } else if (noteTags.includes(rawTag as NoteTag)) {
    tag = rawTag as NoteTag;
  } else {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tag ?? 'all'],
    queryFn: () => fetchNotes('', 1, 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
