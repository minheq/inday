import React from 'react';
import { v4 } from 'uuid';

import { Card, Content, Preview } from './types';
import { useFirebase } from '../firebase';
import { useCache } from './cache';
import { Workspace } from './workspace';
import { BlockType } from '../editor/editable/nodes/element';
import { useAsync } from '../hooks/use_async';

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

    await db.collection(Collection.Workspaces).doc(workspace.id).set(workspace);

    return workspace;
  }, [db]);

  const getWorkspace = React.useCallback(async () => {
    const cached = await cache.readWorkspace();

    if (cached !== null) {
      return cached;
    }

    const workspace = await createWorkspace();

    await cache.writeWorkspace(workspace);

    return workspace;
  }, [createWorkspace, cache]);

  const workspace = useAsync('workspace', getWorkspace);

  return workspace;
}

export function useGetAllCards(): Card[] {
  const workspace = useGetWorkspace();
  const db = useDB();
  const cache = useCache();

  const getAllCardsFromDB = React.useCallback(async () => {
    const collection = await db
      .collection(Collection.Workspaces)
      .doc(workspace.id)
      .collection(Collection.Cards)
      .orderBy('createdAt', 'asc')
      .get();

    const cards = collection.docs.map((c) => c.data()) as Card[];

    return cards;
  }, [workspace, db]);

  const getAllCards = React.useCallback(async () => {
    const cached = await cache.readAllCards();

    console.log(cached);

    if (cached !== null) {
      return cached;
    }

    const cards = await getAllCardsFromDB();

    await cache.writeCards(cards);

    return cards;
  }, [getAllCardsFromDB, cache]);

  const cards = useAsync('allCards', getAllCards);

  return cards;
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

      if (cached !== null) {
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
  const getCardCallback = useGetCardCallback();

  const getCard = React.useCallback(async () => {
    return getCardCallback(id);
  }, [getCardCallback, id]);

  const { data } = useAsync(`Card:${id}`, getCard);

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
