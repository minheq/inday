import React, { useMemo, useEffect } from "react";

import { ScreenName, ScreenProps, useNavigation } from "../../config/routes";
import { useViewQuery } from "../../store/queries";
import { Screen } from "../../components/screen";
import { matchPathname } from "../../../lib/pathname";
import { SpaceScreenContext } from "./space_screen_context";
import { SpaceScreenHeader } from "./space_screen_header";
import { SpaceScreenViewBar } from "./space_screen_view_bar";
import { SpaceScreenViewContent } from "./space_screen_view_content";

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
        <SpaceScreenViewBar />
        <SpaceScreenViewContent />
      </Screen>
    </SpaceScreenContext.Provider>
  );
}
