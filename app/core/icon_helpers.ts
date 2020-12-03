import { IconName, tokens } from '../components';
import { FieldType } from '../data/fields';
import { ViewType } from '../data/views';

const viewIconMap: { [viewType in ViewType]: IconName } = {
  list: 'Table',
  board: 'Board',
};

export function getViewIcon(viewType: ViewType): IconName {
  return viewIconMap[viewType];
}

const viewIconColorMap: { [viewType in ViewType]: string } = {
  list: tokens.colors.blue[600],
  board: tokens.colors.red[600],
};

export function getViewIconColor(viewType: ViewType): string {
  return viewIconColorMap[viewType];
}

const fieldIconMap: { [fieldType in FieldType]: IconName } = {
  [FieldType.Checkbox]: 'Checkbox',
  [FieldType.Currency]: 'Currency',
  [FieldType.Date]: 'CalendarEvent',
  [FieldType.Email]: 'Email',
  [FieldType.MultiCollaborator]: 'User',
  [FieldType.MultiLineText]: 'AlignLeft',
  [FieldType.MultiOption]: 'MultiSelect',
  [FieldType.MultiRecordLink]: 'LinkToRecord',
  [FieldType.Number]: 'Number',
  [FieldType.PhoneNumber]: 'Phone',
  [FieldType.SingleCollaborator]: 'User',
  [FieldType.SingleLineText]: 'Typography',
  [FieldType.SingleOption]: 'Select',
  [FieldType.SingleRecordLink]: 'LinkToRecord',
  [FieldType.URL]: 'Link',
};

export function getFieldIcon(fieldType: FieldType): IconName {
  return fieldIconMap[fieldType];
}
