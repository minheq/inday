import { AppRegistry } from "react-native";
import React, { Suspense } from "react";
import { RecoilRoot } from "recoil";

import { Text } from "./app/components/text";
import { ErrorBoundary } from "./app/config/error_boundary";
import { SpaceScreen } from "./app/screens/space/space_screen";

import { Playground } from "./app/components/playground";
import { Router, ScreenName } from "./app/config/routes";

export function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense fallback={<Text>Loading...</Text>}>
          <Router
            pathMap={{
              Space: {
                path: "/s/:spaceID/:viewID",
                component: SpaceScreen,
              },
              Playground: {
                path: "/playground/:component",
                component: Playground,
              },
            }}
            fallback={
              <SpaceScreen
                name={ScreenName.Space}
                params={{ viewID: "viw1", spaceID: "spc1" }}
              />
            }
          />
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

AppRegistry.registerComponent("App", () => App);

AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root"),
});
