export enum RecoilKey {
  // Atoms
  Workspace = 'Workspace',
  SpacesByID = 'SpacesByID',
  CollectionsByID = 'CollectionsByID',
  ViewsByID = 'ViewsByID',
  FiltersByID = 'FiltersByID',
  FieldsByID = 'FieldsByID',
  DocumentsByID = 'DocumentsByID',
  Events = 'Events',

  // Selectors
  Collection = 'Collection',
  Collections = 'Collections',
  View = 'View',
  ViewDocuments = 'ViewDocuments',
  ViewFilters = 'ViewFilters',
  Views = 'Views',
  Field = 'Field',
  Fields = 'Fields',
  Filters = 'Filters',
  Document = 'Document',
  Documents = 'Documents',
  Space = 'Space',
  Spaces = 'Spaces',
}

export enum StorageKey {
  WorkspaceID = 'WorkspaceID',
  Navigation = 'Navigation',
  Menu = 'Menu',
}

export enum StorageKeyPrefix {}

export enum FieldType {
  SingleLineText = 'SingleLineText',
  MultiLineText = 'MultiLineText',
  SingleSelect = 'SingleSelect',
  MultiSelect = 'MultiSelect',
  SingleCollaborator = 'SingleCollaborator',
  MultiCollaborator = 'MultiCollaborator',
  SingleDocumentLink = 'SingleDocumentLink',
  MultiDocumentLink = 'MultiDocumentLink',
  Date = 'Date',
  PhoneNumber = 'PhoneNumber',
  Email = 'Email',
  URL = 'URL',
  Number = 'Number',
  Currency = 'Currency',
  Checkbox = 'Checkbox',
}
