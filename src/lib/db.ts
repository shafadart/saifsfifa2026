import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase securely (avoid duplicate initialization on hot reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

export interface Key {
  keyId: string;
  status: 'unused' | 'used';
  generatedAt: number;
  usedByDeviceId: string | null;
  expiresAt: number | null; 
}

export interface Device {
  deviceId: string;
  firstAccessed: number;
  isBanned: boolean;
  activeKey: string | null;
  expiresAt: number | null;
}

// --- Keys Operations ---
export const fetchKeys = async (): Promise<Key[]> => {
  const snapshot = await getDocs(collection(db, 'keys'));
  return snapshot.docs.map(doc => doc.data() as Key);
};

export const fetchKey = async (keyId: string): Promise<Key | null> => {
  const docRef = doc(db, 'keys', keyId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Key) : null;
};

export const saveKey = async (key: Key): Promise<void> => {
  await setDoc(doc(db, 'keys', key.keyId), key, { merge: true });
};

export const removeKey = async (keyId: string): Promise<void> => {
  await deleteDoc(doc(db, 'keys', keyId));
};

// --- Devices Operations ---
export const fetchDevices = async (): Promise<Device[]> => {
  const snapshot = await getDocs(collection(db, 'devices'));
  return snapshot.docs.map(doc => doc.data() as Device);
};

export const fetchDevice = async (deviceId: string): Promise<Device | null> => {
  const docRef = doc(db, 'devices', deviceId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Device) : null;
};

export const saveDevice = async (device: Device): Promise<void> => {
  await setDoc(doc(db, 'devices', device.deviceId), device, { merge: true });
};
