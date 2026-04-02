import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

const createPageUrl = 'https://notehub.vercel.app/notes/action/create';

export const metadata: Metadata = {
  title: 'Create note | NoteHub',
  description: 'Create a new note in NoteHub and keep your ideas organized.',
  alternates: {
    canonical: '/notes/action/create',
  },
  openGraph: {
    title: 'Create note | NoteHub',
    description: 'Create a new note in NoteHub and keep your ideas organized.',
    url: createPageUrl,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
