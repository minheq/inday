import { atom } from "recoil";
import { DocumentID } from "../../../models/documents";

export type OpenDocumentState = DocumentID | null;

export const openDocumentState = atom<OpenDocumentState>({
  key: "SpaceScreen_OpenDocument",
  default: null,
});

export type ModeState = "edit" | "select";

export const modeState = atom<ModeState>({
  key: "SpaceScreen_Mode",
  default: "edit",
});

export type SidePanelState = "views" | "organize" | null;

export const sidePanelState = atom<SidePanelState>({
  key: "SpaceScreen_SidePanel",
  default: null,
});

export type SelectedDocumentsState = DocumentID[];

export const selectedDocumentsState = atom<SelectedDocumentsState>({
  key: "SpaceScreen_SelectedDocuments",
  default: [],
});
