// database/firebaseDb.js
import * as firebase from 'firebase';
import firestore from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyCtqhzMGw3L-u16IQmA812KvzEc_6n9uHk",
    authDomain: "reactnativefirebase-4531b.firebaseapp.com",
    databaseURL: "https://reactnativefirebase-00000.firebaseio.com",
    projectId: "reactnativefirebase-4531b",
    storageBucket: "reactnativefirebase-00000.appspot.com",
    messagingSenderId: "180220835869",
    appId: "app-1-180220835869-ios-07f7e29e9e6f8f0ca2aef4"
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();
export default firebase;