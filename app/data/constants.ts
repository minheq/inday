export enum RecoilKey {
  // Atoms
  Workspace = 'Workspace',
  SpacesByID = 'SpacesByID',
  CollectionsByID = 'CollectionsByID',
  SortsByID = 'SortsByID',
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
  ViewSorts = 'ViewSorts',
  Sort = 'Sort',
  Sorts = 'Sorts',
  Views = 'Views',
  Field = 'Field',
  Fields = 'Fields',
  Filter = 'Filter',
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
  SingleOption = 'SingleOption',
  MultiOption = 'MultiOption',
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
