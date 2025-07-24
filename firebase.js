// firebase.js
//
// This module provides Firebase authentication integration using the CommonJS
// module system. The original `firebase.js` in the Feelynx repository used
// ES module syntax (e.g. `import { initializeApp } from "firebase/app";`) while
// the project is configured with `"type": "commonjs"` in its `package.json`.
// Mixing ES module syntax with a CommonJS project causes runtime errors in
// Node.js. This file replaces the ES module `import` statements with
// `require` calls and exports the `auth` instance via `module.exports` so
// that it can be consumed using `require()` in other CommonJS modules.

// Load environment variables from a `.env` file.  If using Firebase inside
// the browser, this line can be removed because environment variables are
// usually baked into the client build.
require('dotenv/config');

// Import only the functions we need from the Firebase SDK.  Using
// destructuring on the return value of `require()` allows us to access
// specific functions without pulling in the entire Firebase library.
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

// Define your Firebase configuration using environment variables.  The
// variables should be defined in a `.env` file or in your hosting
// environment.  Refer to the Firebase documentation for the meaning of each
// property.  See `.env.example` in the repository for the required keys.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize the Firebase app with the provided configuration.  If your
// environment might initialize Firebase multiple times (for example in a
// serverless function that is executed repeatedly), consider checking
// `getApps().length` to avoid duplicate initialization.
const app = initializeApp(firebaseConfig);

// Create an authentication instance associated with our Firebase app.  This
// instance can be used for sign-in, sign-out and other authentication
// operations.  Export it so that other modules in the project can access
// Firebase authentication without reinitializing the app.
const auth = getAuth(app);

module.exports = { auth };
