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
  [FieldType.Checkbox]: "Checkbox",
  [FieldType.Currency]: "Currency",
  [FieldType.Date]: "CalendarEvent",
  [FieldType.Email]: "Email",
  [FieldType.MultiCollaborator]: "User",
  [FieldType.MultiLineText]: "AlignLeft",
  [FieldType.MultiSelect]: "MultiSelect",
  [FieldType.MultiDocumentLink]: "LinkToDocument",
  [FieldType.Number]: "Number",
  [FieldType.PhoneNumber]: "Phone",
  [FieldType.SingleCollaborator]: "User",
  [FieldType.SingleLineText]: "Typography",
  [FieldType.SingleSelect]: "Select",
  [FieldType.SingleDocumentLink]: "LinkToDocument",
  [FieldType.URL]: "Link",
};

export function getFieldIcon(fieldType: FieldType): IconName {
  return fieldIconMap[fieldType];
}
