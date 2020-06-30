import AsyncStorage from '@react-native-community/async-storage';
import { Card } from './types';
import { CardsState } from './atoms';

export enum StorageKey {
  AllCardIDs = 'AllCardIDs',
  InboxCardIDs = 'InboxCardIDs',
  WorkspaceID = 'WorkspaceID',
}

export async function getCardsStateFromStorage() {
  const keys = await AsyncStorage.getAllKeys();

  // Cards state
  const cardKeys = keys.filter((k) => k.split(':')[0] === 'Card');
  const cardJSONs = await AsyncStorage.multiGet(cardKeys);
  const cardsByID: { [id: string]: Card } = {};
  cardJSONs.forEach(([, value]) => {
    if (!value) {
      return null;
    }
    const card = JSON.parse(value) as Card;

    cardsByID[card.id] = card;
  });

  const allCardIDs = await AsyncStorage.getItem(StorageKey.AllCardIDs);
  let all: string[] = [];
  if (allCardIDs) {
    all = JSON.parse(allCardIDs) as string[];
  }

  const inboxCardIDs = await AsyncStorage.getItem(StorageKey.InboxCardIDs);
  let inbox: string[] = [];
  if (inboxCardIDs) {
    inbox = JSON.parse(inboxCardIDs) as string[];
  }

  const cardsState: CardsState = {
    cardsByID,
    all,
    inbox,
    listsByID: {},
  };

  return cardsState;
}
