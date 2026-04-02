import type { Note } from '@/types/note';
import Link from 'next/link';
import css from './NoteItem.module.css';

interface NoteItemProps {
  item: Note;
  onDelete: (id: string) => void;
}

const NoteItem = ({ item, onDelete }: NoteItemProps) => {
  return (
    <li className={css.listItem}>
      <h2 className={css.title}>{item.title}</h2>
      <p className={css.content}>{item.content}</p>
      <div className={css.footer}>
        <span className={css.tag}>{item.tag}</span>
        <div>
          <Link href={`/notes/${item.id}`} className={css.link}>
            View details
          </Link>
          <button className={css.button} onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default NoteItem;
