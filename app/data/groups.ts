import { BaseSort, SortConfig } from './sorts';

export type GroupID = string;
export type GroupConfig = SortConfig;

export interface Group extends BaseSort, GroupConfig {
  id: GroupID;
}

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
