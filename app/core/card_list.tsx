import React from 'react';
import { ScrollView } from 'react-native';
import { CardListItem } from './card_list_item';
import { Card } from '../data/types';
import { Content, Text, Spacer } from '../components';
import { CreateCard } from './card_create';

interface CardListState {
  cardID: string | null;
  newCard: Card | null;
}

interface CardListContext extends CardListState {
  onOpen: (cardID: string) => void;
  onClear: () => void;
  onNewCard: (card: Card) => void;
}

const CardListContext = React.createContext<CardListContext>({
  cardID: null,
  newCard: null,
  onNewCard: () => {},
  onOpen: () => {},
  onClear: () => {},
});

export function useCardList() {
  return React.useContext(CardListContext);
}

interface CardListProps {
  cards: Card[];
}

export interface ScrollViewState {
  contentHeight: number;
  height: number;
  offsetY: number;
}

export function CardList(props: CardListProps) {
  const { cards } = props;
  const [state, setState] = React.useState<CardListState>({
    cardID: null,
    newCard: null,
  });

  const handleNewCard = React.useCallback((newCard: Card) => {
    setState({
      cardID: null,
      newCard,
    });
  }, []);

  const handleOpen = React.useCallback((cardID: string) => {
    setState({
      cardID,
      newCard: null,
    });
  }, []);

  const handleClear = React.useCallback(() => {
    setState({
      cardID: null,
      newCard: null,
    });
  }, []);

  return (
    <CardListContext.Provider
      value={{
        cardID: state.cardID,
        newCard: state.newCard,
        onNewCard: handleNewCard,
        onOpen: handleOpen,
        onClear: handleClear,
      }}
    >
      <ScrollView>
        <Content>
          <Text bold size="lg">
            Inbox
          </Text>
          <Spacer size={16} />
          <CreateCard />
          <Spacer size={24} />
          {cards
            .filter((card) => card.id !== state.newCard?.id)
            .map((card) => (
              <CardListItem key={card.id} card={card} />
            ))}
        </Content>
      </ScrollView>
    </CardListContext.Provider>
  );
}
