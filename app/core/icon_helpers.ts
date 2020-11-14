import { IconName } from '../components';
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

const viewIconColorMap: { [viewType in ViewType]: string } = {
  list: palette.blue[400],
  board: palette.red[400],
};

export function getViewIconColor(viewType: ViewType): string {
  return viewIconColorMap[viewType];
}

const fieldIconMap: { [fieldType in FieldType]: IconName } = {
  [FieldType.Checkbox]: 'Archive',
  [FieldType.Currency]: 'Archive',
  [FieldType.Date]: 'Archive',
  [FieldType.Email]: 'Archive',
  [FieldType.MultiCollaborator]: 'Archive',
  [FieldType.MultiLineText]: 'Archive',
  [FieldType.MultiOption]: 'Archive',
  [FieldType.MultiRecordLink]: 'Archive',
  [FieldType.Number]: 'Archive',
  [FieldType.PhoneNumber]: 'Archive',
  [FieldType.SingleCollaborator]: 'Archive',
  [FieldType.SingleLineText]: 'Archive',
  [FieldType.SingleOption]: 'Archive',
  [FieldType.SingleRecordLink]: 'Archive',
  [FieldType.URL]: 'Archive',
};

export function getFieldIcon(fieldType: FieldType): IconName {
  return fieldIconMap[fieldType];
}
