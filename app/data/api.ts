import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  allCardsQuery,
  cardsByIDState,
  workspaceState,
  eventsState,
} from './atoms';
import { Card, Content, Preview, Event, Workspace } from './types';
import { v4 } from 'uuid';
import { BlockType } from '../editor/editable/nodes/element';
import { useEventEmitter } from './events';

export function useGetAllCards() {
  return useRecoilValue(allCardsQuery);
}

export function useGetWorkspace() {
  const workspace = useRecoilValue(workspaceState);

  if (workspace === null) {
    throw new Error('Workspace not found');
  }

  return workspace;
}

function useEmitEvent() {
  const eventEmitter = useEventEmitter();
  const setEvents = useSetRecoilState(eventsState);

  const emitEvent = React.useCallback(
    (event: Event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
      eventEmitter.emit(event);
    },
    [setEvents, eventEmitter],
  );

  return emitEvent;
}

export function useCreateCard() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();

  const createCard = React.useCallback(() => {
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
      inbox: false,
      listID: null,
      scheduledAt: null,
      typename: 'Card',
    };

    const nextWorkspace: Workspace = {
      ...workspace,
      all: [...workspace.all, card.id],
    };

    emitEvent({
      name: 'CardCreated',
      card,
      workspace: nextWorkspace,
      createdAt: new Date(),
    });

    return card;
  }, [emitEvent, workspace]);

  return createCard;
}

export function useDeleteCard() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();

  const deleteCard = React.useCallback(
    (card: Card) => {
      const nextWorkspace: Workspace = {
        ...workspace,
        all: [...workspace.all, card.id],
      };

      emitEvent({
        name: 'CardDeleted',
        card,
        workspace: nextWorkspace,
        createdAt: new Date(),
      });
    },
    [workspace, emitEvent],
  );

  return deleteCard;
}

export interface UpdateCardContentInput {
  id: string;
  content: Content;
}

export function useUpdateCardContent() {
  const cardsByID = useRecoilValue(cardsByIDState);
  const emitEvent = useEmitEvent();

  const updateCardContent = React.useCallback(
    (input: UpdateCardContentInput) => {
      const { id, content } = input;
      const prevCard = cardsByID[id];
      const preview = toPreview(content);
      const nextCard: Card = {
        ...prevCard,
        content,
        preview,
      };

      emitEvent({
        name: 'CardUpdated',
        prevCard,
        nextCard,
        createdAt: new Date(),
      });
    },
    [cardsByID, emitEvent],
  );

  return updateCardContent;
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
