import React from 'react';
import { v4 } from 'uuid';

import { Element } from '../editor/editable/nodes/element';
import { data } from './fake';
import { Reminder } from '../core/reminder';

export type Content = Element[];
export interface Task {
  completed: boolean;
}

export interface Preview {
  title: string | null;
  description: string | null;
  imageURL: string | null;
}

export interface Card {
  id: string;
  content: Content;
  preview: Preview;
  labelIDs: string[];
  reminder: Reminder | null;
  task: Task | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CardStoreContext {
  getByID: (id: string) => Card | null;
  getManyByDate: (date: string) => Card[];
  createNewCard: () => Card;
  updateCardTask: (id: string, task: Task | null) => void;
  updateCardReminder: (id: string, reminder: Reminder | null) => void;
  updateCardContent: (id: string, content: Content) => void;
  updateCardPreview: (id: string, preview: Preview) => void;
}

const CardStoreContext = React.createContext<CardStoreContext>({
  getByID: () => null,
  getManyByDate: () => [],
  createNewCard: () => {
    return {
      content: [],
      preview: {
        title: null,
        description: null,
        imageURL: null,
      },
      id: '',
      labelIDs: [],
      reminder: null,
      task: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
  updateCardTask: () => {},
  updateCardReminder: () => {},
  updateCardContent: () => {},
  updateCardPreview: () => {},
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
  const [value, setValue] = React.useState<State>({
    cardsByID: data,
    cardsByDate: {
      '2020-06-06': ['1'],
    },
  });

  const { cardsByDate, cardsByID } = value;

  const handleGetByID = React.useCallback(
    (id: string) => {
      if (cardsByID[id]) {
        return cardsByID[id];
      }

      return null;
    },
    [cardsByID],
  );

  const handleGetManyByDate = React.useCallback(
    (date: string) => {
      if (cardsByDate[date]) {
        const cardIDs = cardsByDate[date];

        return cardIDs.map((id) => cardsByID[id]);
      }

      return [];
    },
    [cardsByDate, cardsByID],
  );

  const handleCreateNewCard = React.useCallback(() => {
    const card = {
      content: [],
      preview: {
        title: 'New card',
        description: 'No additional text',
        imageURL: null,
      },
      id: v4(),
      labelIDs: [],
      reminder: null,
      task: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    cardsByID[card.id] = card;

    return card;
  }, [cardsByID]);

  const handleUpdateCardTask = React.useCallback(
    (id: string, task: Task | null) => {
      cardsByID[id].task = task;

      setValue({
        cardsByID,
        cardsByDate,
      });
    },
    [cardsByID, cardsByDate],
  );

  const handleUpdateCardReminder = React.useCallback(
    (id: string, reminder: Reminder | null) => {
      cardsByID[id].reminder = reminder;

      setValue({
        cardsByID,
        cardsByDate,
      });
    },
    [cardsByID, cardsByDate],
  );

  const handleUpdateCardContent = React.useCallback(
    (id: string, content: Content) => {
      cardsByID[id].content = content;

      setValue({
        cardsByID,
        cardsByDate,
      });
    },
    [cardsByID, cardsByDate],
  );

  const handleUpdateCardPreview = React.useCallback(
    (id: string, preview: Preview) => {
      cardsByID[id].preview = preview;

      setValue({
        cardsByID,
        cardsByDate,
      });
    },
    [cardsByID, cardsByDate],
  );

  return (
    <CardStoreContext.Provider
      value={{
        getByID: handleGetByID,
        getManyByDate: handleGetManyByDate,
        createNewCard: handleCreateNewCard,
        updateCardTask: handleUpdateCardTask,
        updateCardReminder: handleUpdateCardReminder,
        updateCardContent: handleUpdateCardContent,
        updateCardPreview: handleUpdateCardPreview,
      }}
    >
      {children}
    </CardStoreContext.Provider>
  );
}
