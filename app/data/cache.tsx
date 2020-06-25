import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from './card';
import { Workspace } from './workspace';
import { useAsync } from '../hooks/use_async';

interface CacheContext {
  readCard: (id: string) => Promise<Card | null>;
  readAllCards: () => Promise<Card[] | null>;
  readInboxCards: () => Promise<Card[] | null>;
  readListCards: (listID: string) => Promise<Card[] | null>;
  readWorkspace: () => Promise<Workspace | null>;
  writeCards: (cards: Card[]) => Promise<void>;
  writeCard: (card: Card) => Promise<void>;
  deleteCard: (cards: Card) => Promise<void>;
  writeWorkspace: (workspace: Workspace) => Promise<void>;
}

const CacheContext = React.createContext<CacheContext>({
  writeCards: async () => {},
  readCard: async () => null,
  writeCard: async () => {},
  deleteCard: async () => {},
  writeWorkspace: async () => {},
  readAllCards: async () => [],
  readInboxCards: async () => [],
  readListCards: async () => [],
  readWorkspace: async () => ({ id: '', name: '', __typename: 'Workspace' }),
});

export function useCache() {
  return React.useContext(CacheContext);
}

interface CacheProviderProps {
  children?: React.ReactNode;
}

interface Cache {
  cardsByID: {
    [id: string]: Card | undefined;
  };
  workspace: Workspace | null;
  all: string[] | null;
  inbox: string[] | null;
  listsByID: {
    [id: string]: string[] | undefined;
  };
}

function getKey(obj: Card | Workspace) {
  return `${obj.__typename}:${obj.id}`;
}

export function CacheProvider(props: CacheProviderProps) {
  const { children } = props;
  const onMount = React.useCallback(async () => {
    const keys = await AsyncStorage.getAllKeys();

    const workspaceKey = keys.filter((k) => k.split(':')[0] === 'Workspace')[0];
    let workspace: Workspace | null = null;
    if (workspaceKey) {
      const workspaceJSON = await AsyncStorage.getItem(workspaceKey);
      if (workspaceJSON) {
        workspace = JSON.parse(workspaceJSON) as Workspace;
      }
    }

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

    return {
      cardsByID,
      workspace,
      all: null,
      inbox: null,
      listsByID: {},
    };
  }, []);

  const initialCache = useAsync('cache', onMount);
  console.log(initialCache);
  const [cache, setCache] = React.useState<Cache>(initialCache);

  const writeCards = React.useCallback(async (cards: Card[]) => {
    const batch = cards.map((c) => {
      const key = getKey(c);
      const value = JSON.stringify(c);

      return [key, value];
    });

    await AsyncStorage.multiSet(batch);

    setCache((prevCache) => {
      cards.map((c) => {
        prevCache.cardsByID[c.id] = c;
      });

      return prevCache;
    });
  }, []);

  const writeCard = React.useCallback(async (card: Card) => {
    const key = getKey(card);
    await AsyncStorage.setItem(key, JSON.stringify(card));

    setCache((prevCache) => {
      prevCache.cardsByID[card.id] = card;

      return prevCache;
    });
  }, []);

  const deleteCard = React.useCallback(async (card: Card) => {
    const key = getKey(card);
    await AsyncStorage.removeItem(key);

    setCache((prevCache) => {
      delete prevCache.cardsByID[card.id];
      return prevCache;
    });
  }, []);

  const writeWorkspace = React.useCallback(async (workspace: Workspace) => {
    const key = getKey(workspace);
    await AsyncStorage.setItem(key, JSON.stringify(workspace));

    setCache((prevCache) => {
      prevCache.workspace = workspace;
      return prevCache;
    });
  }, []);

  const getCardsFromCardIDs = React.useCallback(
    (cardIDs: string[] | null) => {
      if (cardIDs === null) {
        return null;
      }

      const cards: Card[] = [];

      for (let i = 0; i < cardIDs.length; i++) {
        const cardID = cardIDs[i];
        const card = cache.cardsByID[cardID];

        if (card === undefined) {
          return null;
        }

        cards.push(card);
      }

      return cards;
    },
    [cache],
  );

  const readCard = React.useCallback(
    async (id: string) => {
      const card = cache.cardsByID[id];

      if (card === undefined) {
        return null;
      }

      return card;
    },
    [cache],
  );

  const readAllCards = React.useCallback(async () => {
    return getCardsFromCardIDs(cache.all);
  }, [getCardsFromCardIDs, cache]);

  const readInboxCards = React.useCallback(async () => {
    return getCardsFromCardIDs(cache.inbox);
  }, [getCardsFromCardIDs, cache]);

  const readListCards = React.useCallback(
    async (listID: string) => {
      const cardIDs = cache.listsByID[listID];

      if (cardIDs === undefined) {
        return null;
      }

      return getCardsFromCardIDs(cardIDs);
    },
    [getCardsFromCardIDs, cache],
  );

  const readWorkspace = React.useCallback(async () => {
    return cache.workspace;
  }, [cache]);

  return (
    <CacheContext.Provider
      value={{
        readCard,
        writeCard,
        writeCards,
        writeWorkspace,
        deleteCard,
        readAllCards,
        readInboxCards,
        readListCards,
        readWorkspace,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
}
