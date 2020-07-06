import { atom } from 'recoil';
import { RecoilKey } from './constants';

export interface ListGroup {
  id: string;
  name: string;
  listIDs: string[];
  typename: 'ListGroup';
}

export type ListGroupsState = { [id: string]: ListGroup };
export const listGroupsState = atom<ListGroupsState>({
  key: RecoilKey.ListGroups,
  default: {},
});
