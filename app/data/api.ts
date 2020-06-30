import { useRecoilValue } from 'recoil';
import { workspaceQuery, allCardsQuery } from './atoms';

export function useGetAllCards() {
  return useRecoilValue(allCardsQuery);
}

export function useGetWorkspace() {
  return useRecoilValue(workspaceQuery);
}
