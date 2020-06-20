import React from 'react';
import { v4 } from 'uuid';
import { useQuery, useMutation, queryCache } from 'react-query';

import { Card, Reminder, Content, Preview } from './card';
import { useWorkspaceCardsCollection } from './workspace';

function toCard(
  document:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
): Card {
  const data = document.data();

  return {
    id: document.id,
    ...data,
  } as Card;
}

export function useGetAllCards(): Card[] {
  const cards = useWorkspaceCardsCollection();

  const fetchAllCards = React.useCallback(async () => {
    const result = await cards.get();
    return result.docs.map(toCard) as Card[];
  }, [cards]);

  const result = useQuery('cards', fetchAllCards, { suspense: true });

  return result.data!;
}

export function useCreateCard(): () => Card {
  const cards = useWorkspaceCardsCollection();

  const createCard = React.useCallback(
    async (card: Card) => {
      await cards.doc(card.id).set(card);

      return card;
    },
    [cards],
  );

  const [mutate] = useMutation(createCard, {
    // When mutate is called:
    onMutate: (newCard) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryCache.cancelQueries('cards');

      // Snapshot the previous value
      const previousCards = queryCache.getQueryData('cards');

      // Optimistically update to the new value
      queryCache.setQueryData<Card[]>('cards', (old) => {
        if (old) {
          return [...old, newCard];
        }

        return [];
      });

      // Return the snapshotted value
      return previousCards;
    },
    // If the mutation fails, use the value returned from onMutate to roll back
    onError: (err, newCard, previousCards) => {
      if (err) {
        console.error(err);
      } else {
        queryCache.setQueryData('cards', previousCards);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryCache.refetchQueries('cards');
    },
  });

  return React.useCallback(() => {
    const card: Card = {
      id: v4(),
      content: [{ type: 'paragraph', children: [{ text: '' }] }],
      preview: {
        title: 'New card',
        description: 'No additional text',
        imageURL: null,
      },
      labelIDs: [],
      reminder: null,
      task: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mutate(card);

    return card;
  }, [mutate]);
}

export function useUpdateCardTask(id: string, task: Task | null): void {}

export function useUpdateCardReminder(
  id: string,
  reminder: Reminder | null,
): void {}

export function useUpdateCardContent(id: string, content: Content): void {}

export function useUpdateCardPreview(id: string, preview: Preview): void {}
