import './firebase';
import React, { Suspense } from 'react';

import { ThemeProvider } from './theme';
import { Row, Text } from './components';
import { SideNavigation } from './core/side_navigation';
import { InboxScreen } from './screens/inbox';
import { WorkspaceIDProvider } from './data/workspace';
import { FirebaseProvider } from './firebase';
import { AppLoader } from './app_loader';
import { DragDropProvider } from './drag_drop/drag_drop_provider';

const firebaseConfig = {
  apiKey: 'AIzaSyC-MhB1W4eBYObS9YUS-rFDtnzJgsFJn08',
  authDomain: 'indayapp.firebaseapp.com',
  databaseURL: 'https://indayapp.firebaseio.com',
  projectId: 'indayapp',
  storageBucket: 'indayapp.appspot.com',
  messagingSenderId: '372897391949',
  appId: '1:372897391949:web:9728fca32ee8408f640304',
  measurementId: 'G-GMD6E6PV44',
};

export function App() {
  return (
    <ThemeProvider>
      <FirebaseProvider config={firebaseConfig}>
        <WorkspaceIDProvider>
          <AppLoader>
            <DragDropProvider>
              <Row expanded>
                <SideNavigation />
                <HomeContainer />
              </Row>
            </DragDropProvider>
          </AppLoader>
        </WorkspaceIDProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

function HomeContainer() {
  return (
    <Suspense fallback={<Text>Loading..</Text>}>
      <InboxScreen />
    </Suspense>
  );
}
