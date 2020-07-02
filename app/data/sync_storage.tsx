import React from 'react';
import { useRecoilValue } from 'recoil';

import { cardsByIDState, allCardIDListState } from './atoms';
import { usePrevious } from '../hooks/use_previous';
import { useLogger } from '../modules/logger';

export function useSaveNewCardToStorage() {}
export function useSaveUpdatedCardToStorage() {}

export function SyncStorage() {
  const logger = useLogger();
  const cardsByID = useRecoilValue(cardsByIDState);
  const allCardIDList = useRecoilValue(allCardIDListState);
  const previousCardsByID = usePrevious(cardsByID);
  const previousAllCardIDList = usePrevious(allCardIDList);

  React.useEffect(() => {
    const previousCardIDs = Object.keys(previousCardsByID);
    const nextCardIDs = Object.keys(cardsByID);

    if (nextCardIDs.length > previousCardIDs.length) {
      logger.debug('Saving new card to storage');
    } else if (nextCardIDs.length < previousCardIDs.length) {
      logger.debug('Deleting card from storage');
    } else if (
      nextCardIDs.length !== 0 &&
      previousCardIDs.length !== 0 &&
      nextCardIDs.length === previousCardIDs.length
    ) {
      logger.debug('Updating card in storage');
    }
  }, [logger, cardsByID, previousCardsByID]);

  React.useEffect(() => {
    logger.debug('Updating all card id list in storage');

    if (previousAllCardIDList.length === allCardIDList.length) {
      return;
    }

    // AsyncStorage.setItem(
    //   StorageKey.AllCardIDList,
    //   JSON.stringify(allCardIDList),
    // );
  }, [logger, previousAllCardIDList, allCardIDList]);

  return null;
}
