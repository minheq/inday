import React from 'react';
import { Element } from '../editor/editable/nodes/element';
import { data } from './fake';

type CardContent = Element[];

export interface Card {
  id: string;
  content: CardContent;
  preview: {
    title: string | null;
    description: string | null;
    imageURL: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CardStoreContext {
  getCardByID: (id: string) => Card | null;
  getCardsByDate: (date: string) => Card[];
}

const CardStoreContext = React.createContext<CardStoreContext>({
  getCardByID: () => null,
  getCardsByDate: () => [],
});

export function useCardStore() {
  return React.useContext(CardStoreContext);
}

interface State {
  cardsByID: {
    [id: string]: Card;
  };
  cardsByDate: {
    [date: string]: string[];
  };
}

interface CardStoreProviderProps {
  children?: React.ReactNode;
}

export function CardStoreProvider(props: CardStoreProviderProps) {
  const { children } = props;
  const [value] = React.useState<State>({
    cardsByID: data,
    cardsByDate: {
      '2020-06-06': ['1'],
    },
  });

  const { cardsByDate, cardsByID } = value;

  const handleGetCardByID = React.useCallback(
    (id: string) => {
      if (cardsByID[id]) {
        return cardsByID[id];
      }

      return null;
    },
    [cardsByID],
  );

  const handleGetCardsByDate = React.useCallback(
    (date: string) => {
      if (cardsByDate[date]) {
        const cardIDs = cardsByDate[date];

        return cardIDs.map((id) => cardsByID[id]);
      }

      return [];
    },
    [cardsByDate, cardsByID],
  );

  return (
    <CardStoreContext.Provider
      value={{
        getCardByID: handleGetCardByID,
        getCardsByDate: handleGetCardsByDate,
      }}
    >
      {children}
    </CardStoreContext.Provider>
  );
}
