export enum RecoilKey {
  // Atoms
  Notes = 'Notes',
  Workspace = 'Workspace',
  Navigation = 'Navigation',
  Menu = 'Menu',
  Events = 'Events',
  Tags = 'Tags',

  // Selectors
  AllNotes = 'AllNotes',
  ArchivedNotes = 'ArchivedNotes',
  DeletedNotes = 'DeletedNotes',
  InboxNotes = 'InboxNotes',
  TagNotes = 'TagNotes',
  NoteList = 'NoteList',
  MenuTags = 'MenuTags',
  Tag = 'Tag',
  Note = 'Note',
}

export enum StorageKey {
  WorkspaceID = 'WorkspaceID',
  Navigation = 'Navigation',
  Menu = 'Menu',
}

export enum StorageKeyPrefix {
  Note = 'Note',
  Workspace = 'Workspace',
  Tag = 'Tag',
}
