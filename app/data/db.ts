import firebase from 'firebase';

export enum Collection {
  Workspaces = 'workspaces',
  Cards = 'cards',
}

export type DB = firebase.firestore.Firestore;

export const db = firebase.firestore();
