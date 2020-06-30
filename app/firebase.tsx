import firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyC-MhB1W4eBYObS9YUS-rFDtnzJgsFJn08',
  authDomain: 'indayapp.firebaseapp.com',
  databaseURL: 'https://indayapp.firebaseio.com',
  projectId: 'indayapp',
  storageBucket: 'indayapp.appspot.com',
  messagingSenderId: '372897391949',
  appId: '1:372897391949:web:9728fca32ee8408f640304',
  measurementId: 'G-GMD6E6PV44',
};

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

db.disableNetwork();
