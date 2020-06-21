import React from 'react';
import { v4 } from 'uuid';
import { useQuery, useMutation, queryCache } from 'react-query';

import { Card, Content, Preview } from './card';
import { useFirebase } from '../firebase';
import { useWorkspaceID, Workspace } from './workspace';
import { BlockType } from '../editor/editable/nodes/element';

export enum Collection {
  Workspaces = 'workspaces',
  Cards = 'cards',
}

export type DB = firebase.firestore.Firestore;

export function useDB() {
  const { db } = useFirebase();

  if (!db) {
    throw new Error('DB not ready.');
  }

  return db;
}

export function useGetWorkspace() {
  const workspaceID = useWorkspaceID();
  const db = useDB();

  const getWorkspace = React.useCallback(async () => {
    const doc = await db
      .collection(Collection.Workspaces)
      .doc(workspaceID)
      .get();

    return doc.data() as Workspace;
  }, [db, workspaceID]);

  const result = useQuery('workspace', getWorkspace, { suspense: true });

  return result.data!;
}

export function useFindOrCreateWorkspace() {
  const db = useDB();

  const findOrCreateWorkspace = React.useCallback(
    async (workspaceID: string) => {
      const workspace = await db
        .collection(Collection.Workspaces)
        .doc(workspaceID)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            const newWorkspace: Workspace = {
              name: 'New workspace',
              id: workspaceID,
            };

            db.collection(Collection.Workspaces)
              .doc(newWorkspace.id)
              .set(newWorkspace);

            return newWorkspace;
          } else {
            return doc.data() as Workspace;
          }
        });

      return workspace;
    },
    [db],
  );

  return findOrCreateWorkspace;
}

export function useGetAllCards(): Card[] {
  const cards = useGetCards();

  return cards;
}

export function useGetCards(): Card[] {
  const workspaceID = useWorkspaceID();
  const db = useDB();

  const getWorkspaceCards = React.useCallback(async () => {
    const collection = await db
      .collection(Collection.Workspaces)
      .doc(workspaceID)
      .collection(Collection.Cards)
      .orderBy('createdAt', 'asc')
      .get();

    return collection.docs.map((c) => c.data()) as Card[];
  }, [workspaceID, db]);

  const result = useQuery('cards', getWorkspaceCards, { suspense: true });

  return result.data!;
}

function isRollback(value: unknown): value is () => void {
  if (typeof value === 'function') {
    return true;
  }

  return false;
}

export function useCreateCard(): () => Card {
  const workspaceID = useWorkspaceID();
  const db = useDB();

  const createCard = React.useCallback(
    async (card: Card) => {
      await db
        .collection(Collection.Workspaces)
        .doc(workspaceID)
        .collection(Collection.Cards)
        .doc(card.id)
        .set(card);

      return card;
    },
    [db, workspaceID],
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
      return () => {
        queryCache.setQueryData('cards', previousCards);
      };
    },
    // If the mutation fails, use the value returned from onMutate to roll back
    onError: (err, newCard, rollback) => {
      if (err) {
        console.error(err);
      } else {
        if (isRollback(rollback)) {
          rollback();
        }
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
        title: '',
        description: '',
        imageURL: '',
      },
      reminder: null,
      task: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mutate(card);

    return card;
  }, [mutate]);
}

export function useUpdateCardContent() {
  const workspaceID = useWorkspaceID();
  const db = useDB();

  const updateCardContent = React.useCallback(
    async (variables: { id: string; content: Content; preview: Preview }) => {
      const { id, content, preview } = variables;

      await db
        .collection(Collection.Workspaces)
        .doc(workspaceID)
        .collection(Collection.Cards)
        .doc(id)
        .update({
          content,
          preview,
        });
    },
    [db, workspaceID],
  );

  const [mutate] = useMutation(updateCardContent);

  return React.useCallback(
    (variables: { id: string; content: Content }) => {
      const { id, content } = variables;

      mutate({
        id,
        content,
        preview: toPreview(content),
      });
    },
    [mutate],
  );
}

function toPreview(content: Content): Preview {
  let title = '';
  const firstNode = content[0];
  const type = firstNode.type as BlockType;

  switch (type) {
    case 'paragraph':
      title = firstNode.children[0].text as string;
      break;

    default:
      title = firstNode.children[0].text as string;
      break;
  }

  return {
    title,
    description: '',
    imageURL: '',
  };
}
