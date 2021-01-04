import { ViewID } from './views';
import { generateID, validateID } from '../lib/id';
import { SortConfig } from './sorts';

export const groupIDPrefix = `grp`;
export type GroupID = `${typeof groupIDPrefix}${string}`;

export function generateGroupID(): GroupID {
  return generateID(groupIDPrefix);
}

export function validateGroupID(id: string): void {
  return validateID(groupIDPrefix, id);
}

export interface BaseGroup {
  id: GroupID;
  viewID: ViewID;
  sequence: number;
}

export interface Group extends BaseGroup, SortConfig {}

export function deleteGroup(
  group: Group,
  groups: Group[],
): { [groupID: string]: Group } {
  const updatedGroups: { [groupID: string]: Group } = {};
  const groupIndex = groups.findIndex((f) => f.id === group.id);

  const nextGroups = groups.slice(groupIndex + 1);

  for (const nextGroup of nextGroups) {
    updatedGroups[nextGroup.id] = {
      ...nextGroup,
      sequence: nextGroup.sequence - 1,
    };
  }

  delete updatedGroups[group.id];

  return updatedGroups;
}
