import { IconName } from "../../components/icon";
import { palette } from "../../components/palette";
import { FieldType } from "../../../models/fields";
import { ViewType } from "../../../models/views";

const viewIconMap: { [viewType in ViewType]: IconName } = {
  list: "Table",
  board: "Board",
};

export function getViewIcon(viewType: ViewType): IconName {
  return viewIconMap[viewType];
}

export function getViewIconColor(viewType: ViewType): string {
  switch (viewType) {
    case "list":
      return palette.blue[600];
    case "board":
      return palette.red[600];
  }
}

const fieldIconMap: { [fieldType in FieldType]: IconName } = {
  [FieldType.Checkbox]: "FieldCheckbox",
  [FieldType.Currency]: "FieldCurrency",
  [FieldType.Date]: "FieldDate",
  [FieldType.Email]: "FieldEmail",
  [FieldType.MultiCollaborator]: "FieldMultiCollaborator",
  [FieldType.MultiLineText]: "FieldMultiLineText",
  [FieldType.MultiSelect]: "FieldMultiSelect",
  [FieldType.MultiDocumentLink]: "FieldMultiDocumentLink",
  [FieldType.Number]: "FieldNumber",
  [FieldType.PhoneNumber]: "FieldPhoneNumber",
  [FieldType.SingleCollaborator]: "FieldSingleCollaborator",
  [FieldType.SingleLineText]: "FieldSingleLineText",
  [FieldType.SingleSelect]: "FieldSingleSelect",
  [FieldType.SingleDocumentLink]: "FieldSingleDocumentLink",
  [FieldType.URL]: "FieldURL",
};

export function getFieldIcon(fieldType: FieldType): IconName {
  return fieldIconMap[fieldType];
}
