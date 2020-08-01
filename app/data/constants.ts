export enum RecoilKey {
  // Atoms
  Workspace = 'Workspace',
  Spaces = 'Spaces',
  Collections = 'Collections',
  Views = 'Views',
  Fields = 'Fields',
  Documents = 'Documents',
  Events = 'Events',

  // Selectors
  Collection = 'Collection',
  CollectionList = 'CollectionList',
  View = 'View',
  ViewList = 'ViewList',
  Field = 'Field',
  FieldList = 'FieldList',
  Document = 'Document',
  DocumentList = 'DocumentList',
  Space = 'Space',
  SpaceList = 'SpaceList',
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
