import { ColorSchemeName } from 'react-native';
import { IconName } from '../components/icon';
import { palette } from '../components/palette';
import { FieldType } from '../data/fields';
import { ViewType } from '../data/views';

const viewIconMap: { [viewType in ViewType]: IconName } = {
  list: 'Table',
  board: 'Board',
};

export function getViewIcon(viewType: ViewType): IconName {
  return viewIconMap[viewType];
}

export function getViewIconColor(
  viewType: ViewType,
  colorScheme: ColorSchemeName,
): string {
  switch (viewType) {
    case 'list':
      return colorScheme === 'dark' ? palette.blue[400] : palette.blue[600];
    case 'board':
      return colorScheme === 'dark' ? palette.red[50] : palette.red[600];
  }
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
