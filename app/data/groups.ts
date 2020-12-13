import { ViewID } from './views';
import { FieldID } from './fields';
import { generateID } from '../../lib/id';
import { SortOrder } from './sorts';

export const groupIDPrefix = `grp`;
export type GroupID = `${typeof groupIDPrefix}${string}`;
export function GroupID(): GroupID {
  return generateID(groupIDPrefix);
}

export interface BaseGroup {
  id: GroupID;
  viewID: ViewID;
  sequence: number;
}

export interface GroupConfig {
  fieldID: FieldID;
  order: SortOrder;
}

export interface Group extends BaseGroup, GroupConfig {}

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
