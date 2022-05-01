import React, { useCallback, useContext, memo } from "react";
import { StyleSheet, View } from "react-native";

import { useViewQuery } from "../../store/queries";
import { ViewID, ViewType } from "../../../models/views";
import { useRecoilState } from "recoil";
import { Row } from "../../components/row";
import { Text } from "../../components/text";
import { Button } from "../../components/button";
import { isEmpty } from "../../../lib/lang_utils";
import { ViewButton } from "../../core/views/view_button";

import { SpaceScreenContext } from "./space_screen_context";
import {
  ModeState,
  modeState,
  openDocumentState,
  selectedDocumentsState,
  sidePanelState,
} from "./space_screen_state";

export function SpaceScreenViewBar() {
  const { viewID } = useContext(SpaceScreenContext);
  const view = useViewQuery(viewID);
  const [mode, setMode] = useRecoilState(modeState);
  const [sidePanel, setSidePanel] = useRecoilState(sidePanelState);
  const [, setOpenDocument] = useRecoilState(openDocumentState);

  const handleToggleView = useCallback(() => {
    if (sidePanel !== "views") {
      setSidePanel("views");
    } else {
      setSidePanel(null);
    }

    setMode("edit");
    setOpenDocument(null);
  }, [sidePanel, setSidePanel, setMode, setOpenDocument]);

  return (
    <View style={styles.viewSettingsRoot}>
      <ViewButton
        viewID={view.id}
        name={view.name}
        type={view.type}
        appearance="outline"
        onPress={handleToggleView}
      />
      {mode === "edit" ? <ViewMenu /> : <SelectMenu />}
    </View>
  );
}

function SelectMenu() {
  const [, setMode] = useRecoilState(modeState);
  const [selectedDocumentIDs, setSelectedDocuments] = useRecoilState(
    selectedDocumentsState
  );

  const handleToggleSelect = useCallback(() => {
    setMode("edit");
    setSelectedDocuments([]);
  }, [setMode, setSelectedDocuments]);

  if (isEmpty(selectedDocumentIDs)) {
    return (
      <Row spacing={4} alignItems="center">
        <Text color="muted">Press on documents to select</Text>
        <Button onPress={handleToggleSelect} title="Cancel" />
      </Row>
    );
  }

  return (
    <Row spacing={4} alignItems="center">
      <Text weight="bold">{`${selectedDocumentIDs.length} Selected`}</Text>
      <Button title="Share" />
      <Button title="Copy" />
      <Button title="Delete" color="error" />
      <Button onPress={handleToggleSelect} title="Cancel" />
    </Row>
  );
}

function ViewMenu() {
  const [sidePanel, setSidePanel] = useRecoilState(sidePanelState);
  const [, setMode] = useRecoilState(modeState);
  const [, setOpenDocument] = useRecoilState(openDocumentState);

  const handleToggleOrganize = useCallback(() => {
    if (sidePanel !== "organize") {
      setSidePanel("organize");
    } else {
      setSidePanel(null);
    }

    setOpenDocument(null);
  }, [sidePanel, setSidePanel, setOpenDocument]);

  const handleToggleSelect = useCallback(() => {
    setMode("select");
    setOpenDocument(null);
  }, [setMode, setOpenDocument]);

  return (
    <Row spacing={4}>
      <Button icon="Search" title="Search" />
      <Button icon="Organize" onPress={handleToggleOrganize} title="Organize" />
      <Button icon="Select" onPress={handleToggleSelect} title="Select" />
      <Button weight="bold" color="primary" icon="Plus" title="Add document" />
    </Row>
  );
}

const styles = StyleSheet.create({
  viewSettingsRoot: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
