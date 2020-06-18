import React from 'react';
import { useQuery, useMutation } from 'react-query';

import { Card, Reminder, Content, Preview } from './card';
import { useWorkspaceCardsCollection } from './workspace';

function toCard(
  document: firebase.firestore.QueryDocumentSnapshot<
    firebase.firestore.DocumentData
  >,
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

  const result = useQuery(['cards'], fetchAllCards, { suspense: true });

  return result.data!;
}

export function useCreateCard(): () => Promise<Card> {
  const cards = useWorkspaceCardsCollection();

  const createCard = React.useCallback(async () => {
    const cardRef = await cards.add({
      content: [],
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
    });

    return (await cardRef.get()).data();
  }, [cards]);

  const [mutate] = useMutation(createCard);

  return React.useCallback(async () => {
    const result = await mutate();

    if (!result) {
      throw new Error('Failed to create');
    }

    return result as Card;
  }, [mutate]);
}

export function useUpdateCardTask(id: string, task: Task | null): void {}

export function useUpdateCardReminder(
  id: string,
  reminder: Reminder | null,
): void {}

export function useUpdateCardContent(id: string, content: Content): void {}

export function useUpdateCardPreview(id: string, preview: Preview): void {}
