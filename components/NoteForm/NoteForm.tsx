'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { noteTags, type NoteDraft, type NoteTag } from '@/types/note';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

type DraftErrors = Partial<Record<keyof NoteDraft, string>>;

const validateDraft = (draft: NoteDraft): DraftErrors => {
  const errors: DraftErrors = {};
  const title = draft.title.trim();

  if (!title) {
    errors.title = 'Title is required';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (title.length > 50) {
    errors.title = 'Title must be at most 50 characters';
  }

  if (draft.content.length > 500) {
    errors.content = 'Content must be at most 500 characters';
  }

  if (!noteTags.includes(draft.tag)) {
    errors.tag = 'Tag is required';
  }

  return errors;
};

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const [errors, setErrors] = useState<DraftErrors>({});
  const [submitError, setSubmitError] = useState('');

  const mutation = useMutation({
    mutationFn: createNote,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const nextDraft: NoteDraft = {
      ...draft,
      [name]: name === 'tag' ? (value as NoteTag) : value,
    };

    setDraft(nextDraft);

    if (errors[name as keyof NoteDraft]) {
      const nextErrors = validateDraft(nextDraft);
      setErrors(nextErrors);
    }
  };

  const submitNote = async (formData: FormData) => {
    const nextDraft: NoteDraft = {
      title: String(formData.get('title') ?? ''),
      content: String(formData.get('content') ?? ''),
      tag: (formData.get('tag') as NoteTag) ?? 'Todo',
    };

    setDraft(nextDraft);
    const nextErrors = validateDraft(nextDraft);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError('');
      return;
    }

    try {
      await mutation.mutateAsync(nextDraft);
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    } catch {
      setSubmitError('Could not create a note. Please try again.');
    }
  };

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      {submitError && <span className={css.error}>{submitError}</span>}

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>
        <button formAction={submitNote} className={css.submitButton} disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
