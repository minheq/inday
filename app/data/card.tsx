import React from 'react';
import { Element } from '../editor/editable/nodes/element';
import { data } from './fake';
import { ReminderDate, ReminderPlace } from '../components';

export type Content = Element[];
export interface Task {
  completed: boolean;
}

export interface Card {
  id: string;
  content: Content;
  preview: {
    title: string | null;
    description: string | null;
    imageURL: string | null;
  };
  labelIDs: string[];
  reminderDate: ReminderDate | null;
  reminderPlace: ReminderPlace | null;
  task: Task | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CardStoreContext {
  getByID: (id: string) => Card | null;
  getManyByDate: (date: string) => Card[];
  updateTask: (id: string, task: Task | null) => void;
  updateReminderDate: (id: string, reminder: ReminderDate | null) => void;
  updateReminderPlace: (id: string, reminder: ReminderPlace | null) => void;
}

const CardStoreContext = React.createContext<CardStoreContext>({
  getByID: () => null,
  getManyByDate: () => [],
  updateTask: () => {},
  updateReminderDate: () => {},
  updateReminderPlace: () => {},
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

  const handleUpdateTask = React.useCallback(
    (id: string, task: Task | null) => {
      cardsByID[id].task = task;

      setValue({
        cardsByID,
        cardsByDate,
      });
    },
    [cardsByID, cardsByDate],
  );

  const handleUpdateReminderDate = React.useCallback(
    (id: string, reminder: ReminderDate | null) => {
      cardsByID[id].reminderDate = reminder;

      setValue({
        cardsByID,
        cardsByDate,
      });
    },
    [cardsByID, cardsByDate],
  );

  const handleUpdateReminderPlace = React.useCallback(
    (id: string, reminder: ReminderPlace | null) => {
      cardsByID[id].reminderPlace = reminder;

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
        updateTask: handleUpdateTask,
        updateReminderDate: handleUpdateReminderDate,
        updateReminderPlace: handleUpdateReminderPlace,
      }}
    >
      {children}
    </CardStoreContext.Provider>
  );
}
