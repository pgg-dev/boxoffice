import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAmkavb2eiHUtQR2sBbL1AQTi2b0hTe_-A",
  authDomain: "boxoffice-app.firebaseapp.com",
  databaseURL: "https://boxoffice-app.firebaseio.com",
  projectId: "boxoffice-app",
  storageBucket: "boxoffice-app.appspot.com",
  messagingSenderId: "822311017221",
  appId: "1:822311017221:web:ff63afb6e105975e53356c",
  measurementId: "G-HYK51T2ZCN"
};

firebase.initializeApp(config);
const firestore = firebase.firestore();

export default firestore;
