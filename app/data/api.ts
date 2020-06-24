import React from 'react';
import { v4 } from 'uuid';
import { useAsync } from 'react-async';

import { Card, Content, Preview } from './card';
import { useFirebase } from '../firebase';
import { useCache } from './cache';
import { Workspace } from './workspace';
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

export function useGetWorkspace(): Workspace {
  const db = useDB();
  const cache = useCache();

  const createWorkspace = React.useCallback(async () => {
    const workspace: Workspace = {
      name: 'New workspace',
      id: v4(),
      __typename: 'Workspace',
    };

    db.collection(Collection.Workspaces).doc(workspace.id).set(workspace);

    return workspace;
  }, [db]);

  const promiseFn = React.useCallback(async () => {
    const cached = await cache.readWorkspace();

    if (cached) {
      return cached;
    }

    const workspace = await createWorkspace();

    await cache.writeWorkspace(workspace);

    return workspace;
  }, [createWorkspace, cache]);

  const { data } = useAsync({ promiseFn, suspense: true });

  return data!;
}

export function useGetAllCards(): Card[] {
  const workspace = useGetWorkspace();
  const db = useDB();
  const cache = useCache();

  const getAllCards = React.useCallback(async () => {
    const collection = await db
      .collection(Collection.Workspaces)
      .doc(workspace.id)
      .collection(Collection.Cards)
      .orderBy('createdAt', 'asc')
      .get();

    const cards = collection.docs.map((c) => c.data()) as Card[];

    return cards;
  }, [workspace, db]);

  const promiseFn = React.useCallback(async () => {
    const cached = await cache.readAllCards();

    if (cached) {
      return cached;
    }

    const cards = await getAllCards();

    await cache.writeCards(cards);

    return cards;
  }, [getAllCards, cache]);

  const { data } = useAsync({ promiseFn, suspense: true });

  return data!;
}

export function useGetCardCallback() {
  const workspace = useGetWorkspace();
  const db = useDB();
  const cache = useCache();

  const getCard = React.useCallback(
    async (id: string) => {
      const cardRef = await db
        .collection(Collection.Workspaces)
        .doc(workspace.id)
        .collection(Collection.Cards)
        .doc(id)
        .get();

      return cardRef.data() as Card | null;
    },
    [db, workspace],
  );

  return React.useCallback(
    async (id: string) => {
      const cached = await cache.readCard(id);

      if (cached) {
        return cached;
      }

      const card = await getCard(id);

      if (card === null) {
        return null;
      }

      await cache.writeCard(card);

      return card;
    },
    [cache, getCard],
  );
}

export function useGetCard(id: string): Card | null {
  const getCard = useGetCardCallback();

  const promiseFn = React.useCallback(async () => {
    return getCard(id);
  }, [getCard, id]);

  const { data } = useAsync({ promiseFn, suspense: true });

  return data!;
}

export function useCreateCard(): () => Promise<Card> {
  const workspace = useGetWorkspace();
  const db = useDB();
  const cache = useCache();

  const createCard = React.useCallback(
    async (card: Card) => {
      await db
        .collection(Collection.Workspaces)
        .doc(workspace.id)
        .collection(Collection.Cards)
        .doc(card.id)
        .set(card);

      return card;
    },
    [db, workspace],
  );

  return React.useCallback(async () => {
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
      inbox: false,
      scheduledAt: null,
      listID: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      __typename: 'Card',
    };

    await createCard(card);

    await cache.writeCard(card);

    return card;
  }, [createCard, cache]);
}

interface UpdateCardContentInputBase {
  id: string;
  content: Content;
}

interface UpdateCardContentInput extends UpdateCardContentInputBase {
  preview: Preview;
}

export function useUpdateCardContent() {
  const getCard = useGetCardCallback();
  const workspace = useGetWorkspace();
  const db = useDB();
  const cache = useCache();

  const updateCardContent = React.useCallback(
    async (input: UpdateCardContentInput) => {
      const { id, content, preview } = input;

      await db
        .collection(Collection.Workspaces)
        .doc(workspace.id)
        .collection(Collection.Cards)
        .doc(id)
        .update({ content, preview });
    },
    [db, workspace],
  );

  return React.useCallback(
    async (input: UpdateCardContentInputBase) => {
      const { id, content } = input;
      const card = await getCard(id);

      if (!card) {
        throw new Error('Card not found');
      }

      const updatedInput: UpdateCardContentInput = {
        id,
        content,
        preview: toPreview(content),
      };

      await updateCardContent(updatedInput);

      await cache.writeCard(card);
    },
    [cache, getCard, updateCardContent],
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
