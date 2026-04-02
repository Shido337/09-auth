import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import css from './page.module.css';
import type { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api/serverApi';

const noteDetailsBaseUrl = 'https://notehub.vercel.app/notes';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const description = note.content.slice(0, 160);
    const title = `${note.title} | NoteHub`;

    return {
      title,
      description,
      alternates: {
        canonical: `/notes/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `${noteDetailsBaseUrl}/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch {
    return {
      title: 'Note not found | NoteHub',
      description: 'The requested note could not be loaded.',
      openGraph: {
        title: 'Note not found | NoteHub',
        description: 'The requested note could not be loaded.',
        url: `${noteDetailsBaseUrl}/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  }
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </main>
  );
}

