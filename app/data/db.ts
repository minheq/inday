import firebase from 'firebase';

export enum Collection {
  Workspaces = 'workspaces',
  Notes = 'notes',
}

export type DB = firebase.firestore.Firestore;

export const db = firebase.firestore();
