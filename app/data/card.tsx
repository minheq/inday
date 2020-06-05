import React from 'react';
import { Element } from '../editor/editable/nodes/element';

type CardContent = Element[];

export interface Card {
  id: string;
  content: CardContent;
}

interface CardStoreContext {
  cardsByID: {
    [id: string]: Card;
  };
}

const CardStoreContext = React.createContext<CardStoreContext>({
  cardsByID: {},
});

export function useCardStore() {
  return React.useContext(CardStoreContext);
}

interface CardStoreProviderProps {
  children?: React.ReactNode;
}

export function CardStoreProvider(props: CardStoreProviderProps) {
  const { children } = props;
  const [value, setValue] = React.useState<CardStoreContext>({
    cardsByID: {},
  });

  return (
    <CardStoreContext.Provider value={value}>
      {children}
    </CardStoreContext.Provider>
  );
}

const initialValue: Element[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
      },
      { text: 'bold', bold: true },
      { text: ', ' },
      { text: 'italic', italic: true },
      { text: ', or anything else you might want to do!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out yourself! Just ' },
      { text: 'select any piece of text and the menu will appear', bold: true },
      { text: '.' },
    ],
  },
];
