import firebase from 'firebase';
import { useFirebase } from '../firebase';

export enum Collection {
  Workspaces = 'workspaces',
  Cards = 'cards',
}

export type DB = firebase.firestore.Firestore;

export function useDB() {
  const { db } = useFirebase();

  if (!db) {
    throw new Error('DB not ready.');
  }

  return db;
}
