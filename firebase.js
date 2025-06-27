// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrF7YbK-NHSALJfFfrQGobnDXDuVH0KE",
  authDomain: "feelynx-47c57.firebaseapp.com",
  projectId: "feelynx-47c57",
  storageBucket: "feelynx-47c57.appspot.com",
  messagingSenderId: "132290937381",
  appId: "1:132290937381:web:0493a870311b376e0035cc",
  measurementId: "G-T194B2JR6R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
