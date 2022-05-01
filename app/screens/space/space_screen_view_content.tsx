import React, { useCallback, useContext, memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useNavigation } from "../../config/routes";
import {
  useSpaceQuery,
  useViewQuery,
  useSpaceCollectionsQuery,
} from "../../store/queries";
import { useCreateDocumentMutation } from "../../store/mutations";
import { Slide } from "../../components/slide";
import { OrganizeView } from "../../core/organize/organize_view";
import { AutoSizer } from "../../lib/autosizer";
import { ViewID } from "../../../models/views";
import { ListView } from "../../core/list_view/list_view";
import { useRecoilState, useRecoilValue } from "recoil";
import { Document, DocumentID } from "../../../models/documents";
import { CollectionID } from "../../../models/collections";
import { SpaceID } from "../../../models/spaces";
import { theme } from "../../components/theme";
import { SpaceScreenContext } from "./space_screen_context";
import {
  modeState,
  openDocumentState,
  selectedDocumentsState,
  sidePanelState,
} from "./space_screen_state";
import { tokens } from "../../components/tokens";
import { Delay } from "../../components/delay";
import { Fade } from "../../components/fade";
import { ViewList } from "../../core/views/view_list";

const VIEWS_MENU_WIDTH = 240;
const ORGANIZE_VIEW_WIDTH = 360;

export function SpaceScreenViewContent() {
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
          <ListView
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
    </View>
  );
}

interface ViewListContainerProps {
  spaceID: SpaceID;
  viewID: ViewID;
}

export const ViewListContainer = memo(function ViewListContainer(
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

const styles = StyleSheet.create({
  mainContentRoot: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: theme.neutral[200],
  },
  viewContainer: {
    flex: 1,
  },
  rightPanel: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: theme.neutral[200],
    backgroundColor: theme.base.white,
  },
});
