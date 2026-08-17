import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function loadShared(key, fallback) {
  try {
    const snap = await getDoc(doc(db, "data", key));
    return snap.exists() ? snap.data().value : fallback;
  } catch (e) {
    console.error("Error cargando", key, e);
    return fallback;
  }
}

export async function saveShared(key, value) {
  try {
    await setDoc(doc(db, "data", key), { value, updatedAt: Date.now() });
  } catch (e) {
    console.error("Error guardando", key, e);
  }
}

export function subscribeShared(key, fallback, callback) {
  return onSnapshot(
    doc(db, "data", key),
    (snap) => callback(snap.exists() ? snap.data().value : fallback),
    (err) => console.error("Error de sincronización en", key, err)
  );
}
