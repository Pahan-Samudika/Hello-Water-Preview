import * as admin from "firebase-admin";

const initializeFirebase = () => {
  if (!admin.apps.length) {
    try {
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey) {
        // Clean surrounding quotes if present (common issue when keys are wrapped in quotes in .env)
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.substring(1, privateKey.length - 1);
        }
        privateKey = privateKey.replace(/\\n/g, "\n");
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } catch (error) {
      console.error("Firebase admin initialization error:", error);
    }
  }
};

let _db: admin.firestore.Firestore | null = null;

export const db = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop, receiver) {
    if (!_db) {
      initializeFirebase();
      _db = admin.firestore();
    }
    const value = Reflect.get(_db, prop);
    if (typeof value === "function") {
      return value.bind(_db);
    }
    return value;
  },
});

