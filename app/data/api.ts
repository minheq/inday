import { useRecoilValue } from 'recoil';
import { allCardsQuery, workspaceQuery } from './atoms';

export function useGetAllCards() {
  return useRecoilValue(allCardsQuery);
}

export function useGetWorkspace() {
  return useRecoilValue(workspaceQuery);
}
