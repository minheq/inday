import React from 'react';
import { NoteList } from '../core/note_list';
import { useGetAllNotes } from '../data/api';
import { Screen } from '../components';

export function InboxScreen() {
  const notes = useGetAllNotes();

  return (
    <Screen>
      <NoteList notes={notes} />
    </Screen>
  );
}
