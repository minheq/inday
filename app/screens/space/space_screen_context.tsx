import { createContext } from "react";
import { CollectionID } from "../../../models/collections";
import { SpaceID } from "../../../models/spaces";
import { ViewID } from "../../../models/views";

interface SpaceScreenContext {
  spaceID: SpaceID;
  viewID: ViewID;
  collectionID: CollectionID;
}

export const SpaceScreenContext = createContext<SpaceScreenContext>({
  spaceID: "spc",
  viewID: "viw",
  collectionID: "col",
});
