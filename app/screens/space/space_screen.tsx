import React, {
  useCallback,
  createContext,
  useContext,
  useMemo,
  memo,
  useEffect,
} from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ScreenName, ScreenProps, useNavigation } from "../../config/routes";
import {
  useSpaceQuery,
  useViewQuery,
  useSpaceCollectionsQuery,
} from "../../store/queries";
import { useCreateDocumentMutation } from "../../store/mutations";
import { Slide } from "../../components/slide";
import { OrganizeView } from "../../core/organize/organize_view";
import { ViewList } from "../../core/views/view_list";
import { AutoSizer } from "../../lib/autosizer";
import { ViewID, ViewType } from "../../../models/views";
import { ListViewView } from "../../core/list_view/list_view_view";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { Document, DocumentID } from "../../../models/documents";
import { CollectionID } from "../../../models/collections";
import { SpaceID } from "../../../models/spaces";
import { Screen } from "../../components/screen";
import { Row } from "../../components/row";
import { BackButton } from "../../components/back_button";
import { Text } from "../../components/text";
import { IconButton } from "../../components/icon_button";
import { FlatButton } from "../../components/flat_button";
import { tokens } from "../../components/tokens";
import { isEmpty } from "../../../lib/lang_utils";
import { CollectionsTabs } from "../../core/collections/collection_tabs";
import { Delay } from "../../components/delay";
import { Fade } from "../../components/fade";
import { ViewButton } from "../../core/views/view_button";
import { matchPathname } from "../../../lib/pathname";
import { DocumentDetailsView } from "./document_details_view";
import { theme } from "../../components/theme";

interface SpaceScreenContext {
  spaceID: SpaceID;
  viewID: ViewID;
  collectionID: CollectionID;
}

const VIEWS_MENU_WIDTH = 240;
const RECORD_VIEW_WIDTH = 360;
const ORGANIZE_VIEW_WIDTH = 360;

const SpaceScreenContext = createContext<SpaceScreenContext>({
  spaceID: "spc",
  viewID: "viw",
  collectionID: "col",
});

export function SpaceScreen(props: ScreenProps<ScreenName.Space>): JSX.Element {
  const { params } = props;
  const { spaceID, viewID } = params;
  const view = useViewQuery(viewID);
  const navigation = useNavigation();

  // TODO: Remove from dev purposes
  useEffect(() => {
    const match = matchPathname(
      "/s/:spaceID/:viewID",
      window.location.pathname
    );

    if (!match) {
      navigation.push(ScreenName.Space, { spaceID, viewID });
    }
  }, [spaceID, viewID, navigation]);

  const context = useMemo(
    () => ({ spaceID, viewID, collectionID: view.collectionID }),
    [spaceID, viewID, view.collectionID]
  );

  return (
    <SpaceScreenContext.Provider value={context}>
      <Screen>
        <SpaceScreenHeader />
        <CollectionsTabs viewID={viewID} spaceID={spaceID} />
        <ViewSettings />
        <MainContent />
      </Screen>
    </SpaceScreenContext.Provider>
  );
}

type SidePanelState = "views" | "organize" | null;

const sidePanelState = atom<SidePanelState>({
  key: "SpaceScreen_SidePanel",
  default: null,
});

type ModeState = "edit" | "select";

const modeState = atom<ModeState>({
  key: "SpaceScreen_Mode",
  default: "edit",
});

type SelectedDocumentsState = DocumentID[];

const selectedDocumentsState = atom<SelectedDocumentsState>({
  key: "SpaceScreen_SelectedDocuments",
  default: [],
});

type OpenDocumentState = DocumentID | null;

const openDocumentState = atom<OpenDocumentState>({
  key: "SpaceScreen_OpenDocument",
  default: null,
});

const SpaceScreenHeader = memo(function SpaceScreenHeader(): JSX.Element {
  const navigation = useNavigation();
  const context = useContext(SpaceScreenContext);
  const { spaceID } = context;
  const space = useSpaceQuery(spaceID);

  const handlePressBack = useCallback(() => {
    navigation.back();
  }, [navigation]);

  return (
    <View style={styles.header}>
      <Row justifyContent="space-between">
        <Row spacing={8} alignItems="center">
          <BackButton onPress={handlePressBack} />
          <Text size="lg" weight="bold">
            {space.name}
          </Text>
        </Row>
        <TopMenu />
      </Row>
    </View>
  );
});

function TopMenu() {
  return (
    <Row spacing={4}>
      <IconButton icon="Users" title="Share" />
      <IconButton icon="Bolt" title="Automate" />
      <IconButton icon="Help" title="Help" />
      <IconButton icon="DotsInCircle" title="More" />
    </Row>
  );
}

function ViewSettings() {
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
    <ViewSettingsView
      viewID={view.id}
      name={view.name}
      type={view.type}
      onToggleView={handleToggleView}
      mode={mode}
    />
  );
}

interface ViewSettingsViewProps {
  onToggleView: () => void;
  mode: ModeState;
  viewID: ViewID;
  name: string;
  type: ViewType;
}

const ViewSettingsView = memo(function ViewSettingsView(
  props: ViewSettingsViewProps
) {
  const { onToggleView, mode, viewID, name, type } = props;

  return (
    <View style={styles.viewSettingsRoot}>
      <Row justifyContent="space-between">
        <ViewButton
          viewID={viewID}
          name={name}
          type={type}
          onPress={onToggleView}
        />
        {mode === "edit" ? <ViewMenu /> : <SelectMenu />}
      </Row>
    </View>
  );
});

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
        <FlatButton onPress={handleToggleSelect} title="Cancel" />
      </Row>
    );
  }

  return (
    <Row spacing={4} alignItems="center">
      <Text weight="bold">{`${selectedDocumentIDs.length} Selected`}</Text>
      <FlatButton title="Share" />
      <FlatButton title="Copy" />
      <FlatButton title="Delete" color="error" />
      <FlatButton onPress={handleToggleSelect} title="Cancel" />
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
      <FlatButton title="Search" />
      <FlatButton onPress={handleToggleOrganize} title="Organize" />
      <FlatButton onPress={handleToggleSelect} title="Select" />
      <FlatButton
        weight="bold"
        color="primary"
        icon="Plus"
        title="Add document"
      />
    </Row>
  );
}

function MainContent() {
  const sidePanel = useRecoilValue(sidePanelState);
  const context = useContext(SpaceScreenContext);
  const { spaceID, viewID, collectionID } = context;
  const space = useSpaceQuery(spaceID);
  const view = useViewQuery(viewID);
  const mode = useRecoilValue(modeState);
  const [selectedDocumentIDs, setSelectedDocuments] = useRecoilState(
    selectedDocumentsState
  );
  const createDocument = useCreateDocumentMutation();
  const [openDocument, setOpenDocument] = useRecoilState(openDocumentState);
  const collections = useSpaceCollectionsQuery(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  if (activeCollection === undefined) {
    throw new Error("Invalid collection");
  }

  const handleOpenDocument = useCallback(
    (documentID: DocumentID) => {
      if (openDocument === documentID) {
        setOpenDocument(null);
        return;
      }

      setOpenDocument(documentID);
    },
    [openDocument, setOpenDocument]
  );

  const handleSelectDocument = useCallback(
    (documentID: DocumentID, selected: boolean) => {
      if (selected === true) {
        setSelectedDocuments((prevSelectedDocuments) =>
          prevSelectedDocuments.concat(documentID)
        );
      } else {
        setSelectedDocuments((prevSelectedDocuments) =>
          prevSelectedDocuments.filter((id) => id !== documentID)
        );
      }
    },
    [setSelectedDocuments]
  );

  const handleAddDocument = useCallback((): Document => {
    return createDocument(collectionID);
  }, [createDocument, collectionID]);

  const renderView = useCallback((): React.ReactNode => {
    switch (view.type) {
      case "list":
        return (
          <ListViewView
            mode={mode}
            view={view}
            selectedDocumentIDs={selectedDocumentIDs}
            onOpenDocument={handleOpenDocument}
            onSelectDocument={handleSelectDocument}
            onAddDocument={handleAddDocument}
          />
        );
      case "board":
        return null;
    }
  }, [
    mode,
    view,
    handleOpenDocument,
    selectedDocumentIDs,
    handleSelectDocument,
    handleAddDocument,
  ]);

  return (
    <View style={styles.mainContentRoot}>
      <Slide width={VIEWS_MENU_WIDTH} visible={sidePanel === "views"}>
        {sidePanel === "views" && (
          <ViewListContainer spaceID={spaceID} viewID={viewID} />
        )}
      </Slide>
      <View style={styles.viewContainer}>{renderView()}</View>
      <Slide width={ORGANIZE_VIEW_WIDTH} visible={sidePanel === "organize"}>
        <OrganizeViewContainer
          spaceID={spaceID}
          viewID={viewID}
          collectionID={collectionID}
        />
      </Slide>
      <Slide width={RECORD_VIEW_WIDTH} visible={openDocument !== null}>
        <DocumentDetailsContainer documentID={openDocument} />
      </Slide>
    </View>
  );
}

interface ViewListContainerProps {
  spaceID: SpaceID;
  viewID: ViewID;
}

const ViewListContainer = memo(function ViewListContainer(
  props: ViewListContainerProps
) {
  const { spaceID, viewID } = props;
  const navigation = useNavigation();

  const handleSelect = useCallback(
    (id: ViewID) => {
      navigation.setParams({ spaceID, viewID: id });
    },
    [spaceID, navigation]
  );

  return (
    <View style={styles.leftPanel}>
      <Delay config={tokens.animation.fast}>
        <Fade config={tokens.animation.fast}>
          <ViewList onSelect={handleSelect} spaceID={spaceID} viewID={viewID} />
        </Fade>
      </Delay>
    </View>
  );
});

interface OrganizeViewContainerProps {
  spaceID: SpaceID;
  viewID: ViewID;
  collectionID: CollectionID;
}

const OrganizeViewContainer = memo(function OrganizeViewContainer(
  props: OrganizeViewContainerProps
) {
  const { spaceID, viewID, collectionID } = props;

  return (
    <View style={styles.rightPanel}>
      <AutoSizer>
        {({ height }) => (
          <View style={{ width: ORGANIZE_VIEW_WIDTH, height }}>
            <ScrollView>
              <OrganizeView
                spaceID={spaceID}
                viewID={viewID}
                collectionID={collectionID}
              />
            </ScrollView>
          </View>
        )}
      </AutoSizer>
    </View>
  );
});

interface DocumentDetailsContainerProps {
  documentID: DocumentID | null;
}

const DocumentDetailsContainer = memo(function DocumentDetailsContainer(
  props: DocumentDetailsContainerProps
) {
  const { documentID } = props;
  const [, setOpenDocument] = useRecoilState(openDocumentState);

  const handleClose = useCallback(() => {
    setOpenDocument(null);
  }, [setOpenDocument]);

  return (
    <View style={styles.rightPanel}>
      <AutoSizer>
        {({ height }) => (
          <View style={{ width: RECORD_VIEW_WIDTH, height }}>
            {documentID && (
              <DocumentDetailsView
                onClose={handleClose}
                documentID={documentID}
              />
            )}
          </View>
        )}
      </AutoSizer>
    </View>
  );
});

const styles = StyleSheet.create({
  mainContentRoot: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: theme.neutral.light,
  },
  viewContainer: {
    paddingTop: 16,
    flex: 1,
  },
  rightPanel: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: theme.neutral.light,
    backgroundColor: theme.base.default,
  },
  header: {
    height: 56,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewSettingsRoot: {
    paddingVertical: 4,
    zIndex: 1,
    ...theme.elevation.level1,
  },
});
