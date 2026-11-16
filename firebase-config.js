/* Cloud login & sync for Stock Journal.
 *
 * 1. Follow SETUP.md to create a free Firebase project.
 * 2. In the Firebase console open  Project settings > Your apps > Web app  and copy the values below.
 *
 * Leave apiKey / projectId empty and the journal keeps working exactly as before
 * (no login, data stays in this browser).
 *
 * These values identify your project; they are not passwords. Your data is protected by the
 * sign-in plus the security rules in firestore.rules.
 */
window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",      // e.g. your-project.firebaseapp.com
  projectId: "",       // e.g. your-project
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
