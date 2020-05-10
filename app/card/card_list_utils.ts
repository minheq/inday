import { CardListItem } from './card_list_item';

export function logTable(positionedCards: CardListItem[]) {
  console.table(positionedCards.map(toInteresting));
}

export function toInteresting(card: CardListItem) {
  return {
    id: card.id,
    y: card.y,
    height: card.height,
    index: card.index,
  };
}

export function debugIsValid(positionedCards: CardListItem[]): boolean {
  let currentY = 0;
  for (let i = 0; i < positionedCards.length - 1; i++) {
    const card = positionedCards[i];
    currentY = card.y;

    const nextCard = positionedCards[i + 1];
    if (currentY + card.height !== nextCard.y) {
      console.log(`Expected ${nextCard.y} to be ${currentY + card.height}`);

      return false;
    }
  }

  return true;
}

export function logIfFaulty(positionedCards: CardListItem[]) {
  if (debugIsValid(positionedCards)) {
    return;
  }

  logTable(positionedCards);
}
