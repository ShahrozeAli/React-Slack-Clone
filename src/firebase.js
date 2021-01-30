import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";


var firebaseConfig = {
    apiKey: "AIzaSyAYiYZLM8iwGZY19KQ-kEjH_sbrJ5eZFCQ",
    authDomain: "react-slack-clone-11964.firebaseapp.com",
    projectId: "react-slack-clone-11964",
    storageBucket: "react-slack-clone-11964.appspot.com",
    messagingSenderId: "488825396580",
    appId: "1:488825396580:web:842de3a6a817f7de612e71",
    measurementId: "G-BVF3TB9LYM",
    databaseURL: "https://react-slack-clone-11964-default-rtdb.firebaseio.com/",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();

  export default firebase;