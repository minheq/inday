import React from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { allCardsQuery, cardsByIDState, workspaceState } from './atoms';
import { Card, Content, Preview } from './types';
import { v4 } from 'uuid';
import { BlockType } from '../editor/editable/nodes/element';

export function useGetAllCards() {
  return useRecoilValue(allCardsQuery);
}

export function useGetWorkspace() {
  return useRecoilValue(workspaceState);
}

export function useCreateCard() {
  const setCardsByID = useSetRecoilState(cardsByIDState);
  const setWorkspace = useSetRecoilState(workspaceState);

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

    setCardsByID((previousCardsByID) => ({
      ...previousCardsByID,
      [card.id]: card,
    }));
    setWorkspace((previousWorkspace) => ({
      ...previousWorkspace,
      all: [...previousWorkspace.all, card.id],
    }));

    return card;
  }, [setCardsByID, setWorkspace]);

  return createCard;
}

export function useDeleteCard() {
  const setCardsByID = useSetRecoilState(cardsByIDState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const deleteCard = React.useCallback(
    (card: Card) => {
      setWorkspace((previousWorkspace) => ({
        ...previousWorkspace,
        all: previousWorkspace.all.filter((cardID) => cardID !== card.id),
      }));

      setCardsByID((previousCardsByID) => {
        const nextCardsByID = { ...previousCardsByID };

        delete nextCardsByID[card.id];

        return nextCardsByID;
      });

      console.timeEnd('hmm');
    },
    [setCardsByID, setWorkspace],
  );

  return deleteCard;
}

export interface UpdateCardContentInput {
  id: string;
  content: Content;
}

export function useUpdateCardContent() {
  const [cardsByID, setCardsByID] = useRecoilState(cardsByIDState);

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

      setCardsByID((previousCardsByID) => ({
        ...previousCardsByID,
        [nextCard.id]: nextCard,
      }));
    },
    [cardsByID, setCardsByID],
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
