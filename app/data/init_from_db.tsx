import React from 'react';
import { db, Collection } from './db';
import { Card } from './types';
import { useRecoilValue, useRecoilState } from 'recoil';
import { workspaceIDState, CardsState, cardsState } from './atoms';
import AsyncStorage from '@react-native-community/async-storage';
import { getCardsStateFromStorage, StorageKey } from './storage';

export async function syncCardsStateInStorage(cardsStateFromDB: CardsState) {
  const cardsStateFromStorage = await getCardsStateFromStorage();

  Object.values(cardsStateFromStorage.cardsByID).map((c) => `Card:${c.id}`);

  Object.values(cardsStateFromDB.cardsByID).forEach(() => {});

  await AsyncStorage.setItem(
    StorageKey.AllCardIDs,
    JSON.stringify(cardsStateFromDB.all),
  );

  await AsyncStorage.setItem(
    StorageKey.InboxCardIDs,
    JSON.stringify(cardsStateFromDB),
  );
}

async function initFromDB(workspaceID: string) {
  const workspaceDocument = db
    .collection(Collection.Workspaces)
    .doc(workspaceID);

  const [workspaceRef, cardsCollectionRef] = await Promise.all([
    workspaceDocument.get(),
    workspaceDocument
      .collection(Collection.Cards)
      .orderBy('createdAt', 'asc')
      .get(),
  ]);
  const workspaceData = workspaceRef.data() as any;

  const cardsByID: { [id: string]: Card } = {};
  cardsCollectionRef.docs.forEach((c) => {
    const card = c.data() as Card;
    cardsByID[card.id] = card;
  });

  const cards: CardsState = {
    cardsByID,
    all: workspaceData.all ?? [],
    inbox: workspaceData.inbox ?? [],
    listsByID: workspaceData.listsByID ?? {},
  };

  return cards;
}

function useInitFromDB() {
  const workspaceID = useRecoilValue(workspaceIDState);
  const [, setCards] = useRecoilState(cardsState);

  React.useEffect(() => {
    initFromDB(workspaceID).then((state) => {
      setCards(state);
    });
  }, [workspaceID, setCards]);
}

export function InitFromDB() {
  useInitFromDB();
  return null;
}
