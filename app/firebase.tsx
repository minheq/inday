import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';

interface FirebaseContext {
  db: firebase.firestore.Firestore | null;
  loading: boolean;
}

export const FirebaseContext = React.createContext<FirebaseContext>({
  db: null,
  loading: true,
});

interface FirebaseProviderProps {
  config: object;
  children?: React.ReactNode;
}

export function useFirebase() {
  return React.useContext(FirebaseContext);
}

export function FirebaseProvider(props: FirebaseProviderProps) {
  const { config, children } = props;
  const [value, setValue] = React.useState<FirebaseContext>({
    db: null,
    loading: true,
  });

  React.useEffect(() => {
    firebase.initializeApp(config);
    firebase.analytics();

    const db = firebase.firestore();

    db.enablePersistence().catch(function (err) {
      if (err.code === 'failed-precondition') {
        console.error('failed-precondition');

        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
      } else if (err.code === 'unimplemented') {
        console.error('unimplemented');
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    });

    // db.disableNetwork();

    setValue({ db, loading: false });
  }, [config]);

  if (value.loading) {
    return null;
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}
