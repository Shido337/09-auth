import css from './layout.module.css';

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={css.main}>{children}</div>;
}
