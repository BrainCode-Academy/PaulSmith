import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let firestoreInstance: Firestore | null = null;

export function getFirestoreDb(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;

  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      console.warn('firebase-applet-config.json not found on disk.');
      return null;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    firestoreInstance = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, config.firestoreDatabaseId)
      : getFirestore(app);

    return firestoreInstance;
  } catch (err) {
    console.error('Failed to initialize Firestore in server:', err);
    return null;
  }
}

// Media Storage (Persistent in Firestore)
export async function saveMediaAsset(
  mediaId: string,
  mimeType: string,
  base64Data: string,
  fileName: string
): Promise<string> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore not initialized');

  const ref = doc(db, 'media', mediaId);
  await setDoc(ref, {
    id: mediaId,
    mimeType,
    data: base64Data,
    size: Buffer.from(base64Data, 'base64').length,
    fileName,
    uploadedAt: new Date().toISOString(),
  });

  return `/api/media/${mediaId}`;
}

export async function getMediaAsset(mediaId: string): Promise<{ mimeType: string; buffer: Buffer } | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const ref = doc(db, 'media', mediaId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      mimeType: data.mimeType || 'image/jpeg',
      buffer: Buffer.from(data.data, 'base64'),
    };
  } catch (err) {
    console.error(`Error loading media asset ${mediaId}:`, err);
    return null;
  }
}

// Collections Persistence Sync
export async function syncDocToFirestore(collectionName: string, docId: string, data: any): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  try {
    const ref = doc(db, collectionName, docId);
    await setDoc(ref, JSON.parse(JSON.stringify(data)), { merge: true });
  } catch (err) {
    console.error(`Error syncing document ${collectionName}/${docId}:`, err);
  }
}

export async function deleteDocFromFirestore(collectionName: string, docId: string): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  try {
    const ref = doc(db, collectionName, docId);
    await deleteDoc(ref);
  } catch (err) {
    console.error(`Error deleting document ${collectionName}/${docId}:`, err);
  }
}

export async function loadCollectionFromFirestore<T = any>(collectionName: string): Promise<T[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as T);
  } catch (err) {
    console.error(`Error loading collection ${collectionName}:`, err);
    return [];
  }
}
