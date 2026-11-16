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
  apiKey: "AIzaSyArG13iIrgV5sCARtRJL5zlRJECmrWI_LY",
  authDomain: "stock-journal-d7971.firebaseapp.com",
  projectId: "stock-journal-d7971",
  storageBucket: "stock-journal-d7971.firebasestorage.app",
  messagingSenderId: "912444260484",
  appId: "1:912444260484:web:1f251cb9badb45dc2502d1"
};
