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
