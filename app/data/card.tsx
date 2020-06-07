import React from 'react';
import { Element } from '../editor/editable/nodes/element';
import { data } from './fake';

export type Content = Element[];
export interface Task {
  completed: boolean;
}

export interface Reminder {
  date: Date;
  recurrence: Recurrence | null;
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
  reminder: Reminder | null;
  task: Task | null;
  createdAt: Date;
  updatedAt: Date;
}

enum WeekDay {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 0,
}

enum Frequency {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
}

interface Recurrence {
  startDate: Date;
  frequency: Frequency;
  interval?: number | null;
  count?: number | null;
  weekStart?: WeekDay | null;
  until?: Date | null;
  timezoneID?: string | null;
  bySetPosition?: number[] | null;
  byMonth?: number[] | null;
  byMonthDay?: number[] | null;
  byYearDay?: number[] | null;
  byWeekNumber?: number[] | null;
  byWeekDay?: WeekDay[] | null;
  byHour?: number[] | null;
  byMinute?: number[] | null;
  bySecond?: number[] | null;
}

interface CardStoreContext {
  getByID: (id: string) => Card | null;
  getManyByDate: (date: string) => Card[];
  updateTask: (id: string, task: Task | null) => void;
}

const CardStoreContext = React.createContext<CardStoreContext>({
  getByID: () => null,
  getManyByDate: () => [],
  updateTask: () => {},
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

  return (
    <CardStoreContext.Provider
      value={{
        getByID: handleGetByID,
        getManyByDate: handleGetManyByDate,
        updateTask: handleUpdateTask,
      }}
    >
      {children}
    </CardStoreContext.Provider>
  );
}
