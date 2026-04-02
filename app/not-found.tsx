import css from './not-found.module.css';
import { Metadata } from 'next';

const notFoundPageUrl = 'https://notehub.vercel.app/not-found';

export const metadata: Metadata = {
  title: 'Page not found | NoteHub',
  description: 'The page you are looking for does not exist in NoteHub.',
  alternates: {
    canonical: '/not-found',
  },
  openGraph: {
    title: 'Page not found | NoteHub',
    description: 'The page you are looking for does not exist in NoteHub.',
    url: notFoundPageUrl,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </>
  );
}
