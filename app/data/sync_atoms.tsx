import React from 'react';
import { useEventEmitter } from './events';
import {
  Event,
  CardCreatedEvent,
  CardDeletedEvent,
  CardUpdatedEvent,
} from './types';
import { useSetRecoilState } from 'recoil';
import { cardsByIDState, workspaceState } from './atoms';

export function SyncAtoms() {
  const eventEmitter = useEventEmitter();
  const setCardsByID = useSetRecoilState(cardsByIDState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const handleCardCreated = React.useCallback(
    (event: CardCreatedEvent) => {
      const { card, workspace } = event;

      setCardsByID((previousCardsByID) => ({
        ...previousCardsByID,
        [card.id]: card,
      }));

      setWorkspace(workspace);
    },
    [setCardsByID, setWorkspace],
  );

  const handleCardDeleted = React.useCallback(
    (event: CardDeletedEvent) => {
      const { card, workspace } = event;

      setWorkspace(workspace);

      setCardsByID((previousCardsByID) => {
        const nextCardsByID = { ...previousCardsByID };

        delete nextCardsByID[card.id];

        return nextCardsByID;
      });
    },
    [setCardsByID, setWorkspace],
  );

  const handleCardUpdated = React.useCallback(
    (event: CardUpdatedEvent) => {
      const { nextCard } = event;

      setCardsByID((previousCardsByID) => ({
        ...previousCardsByID,
        [nextCard.id]: nextCard,
      }));
    },
    [setCardsByID],
  );

  const handleEvent = React.useCallback(
    (event: Event) => {
      switch (event.name) {
        case 'CardCreated':
          return handleCardCreated(event);
        case 'CardDeleted':
          return handleCardDeleted(event);
        case 'CardUpdated':
          return handleCardUpdated(event);
        default:
          break;
      }
    },
    [handleCardCreated, handleCardDeleted, handleCardUpdated],
  );

  React.useEffect(() => {
    eventEmitter.subscribe(handleEvent);

    return () => {
      eventEmitter.unsubscribe(handleEvent);
    };
  }, [eventEmitter, handleEvent]);

  return null;
}
