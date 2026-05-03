import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import firebaseAppletConfig from '../firebase-applet-config.json';

// Support for Vercel / Production environment variables
const v_apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const v_authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const v_projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const v_databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID;

const firebaseConfig = {
  apiKey: v_apiKey || firebaseAppletConfig.apiKey,
  authDomain: v_authDomain || firebaseAppletConfig.authDomain,
  projectId: v_projectId || firebaseAppletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
  firestoreDatabaseId: v_databaseId || firebaseAppletConfig.firestoreDatabaseId || '(default)',
};

if (v_projectId || v_databaseId) {
  console.log("[Firebase] Using environment variable overrides for project/database.");
} else {
  console.log("[Firebase] Using default configuration from firebase-applet-config.json");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Force local persistence for better cross-origin reliability
setPersistence(auth, browserLocalPersistence).catch(err => console.error("Persistence error:", err));

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId === '(default)' ? undefined : firebaseConfig.firestoreDatabaseId);

// Customizing Google Provider for better popup reliability
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account',
});

// Firestore Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Connection test
async function testFirestoreConnection() {
  const { getDocFromServer, doc } = await import('firebase/firestore');
  try {
    console.log(`[Firebase] Testing connection to ${firebaseConfig.projectId}/${firebaseConfig.firestoreDatabaseId}...`);
    await getDocFromServer(doc(db, '_connection_test_', 'test'));
    console.log("Firestore connection check passed.");
  } catch (error) {
    const err = error as any;
    
    // permission-denied is actually a SUCCESS for connectivity (reached the backend)
    if (err.code === 'permission-denied') {
      console.log("Firestore connection check: REACHED (Access Restricted). Backend is online.");
      return;
    }

    console.error(`[Firebase] Connection test failed: ${err.code || 'unknown'} - ${err.message}`);
    
    if (err.code === 'unavailable') {
      console.warn("Firestore service is unavailable. This usually means the Project ID or Database ID is incorrect, or the service is not enabled.");
    }
  }
}
testFirestoreConnection();

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const message = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  // Show alert for administrative visibility
  if (message.includes('permission-denied') || message.includes('Missing or insufficient permissions')) {
    let friendlyMessage = `Security Error: You don't have permission to ${operationType} at ${path}.`;
    
    if (path?.startsWith('users/') && operationType === OperationType.GET) {
      friendlyMessage = `Your profile could not be loaded. This might be a temporary authentication sync issue. Please try signing out and back in.`;
    } else if (path?.startsWith('bookings/') || path?.startsWith('inquiries/')) {
      friendlyMessage = `You don't have administrative permissions to view these records. Please ensure you are logged in with an admin account.`;
    }
    
    window.alert(friendlyMessage);
  } else if (message.includes('unavailable') || message.includes('Could not reach Cloud Firestore')) {
    window.alert(`Firestore Connectivity Error: The database is currently unreachable. \n\nThis is usually caused by: \n1. Incorrect VITE_FIREBASE_PROJECT_ID or VITE_FIREBASE_DATABASE_ID in settings. \n2. Firestore is not enabled for the project. \n3. Browser network restrictions. \n\nIf you recently changed environment variables, please ensure they match your Firebase Console configuration exactly.`);
  } else {
    window.alert(`Database Error (${operationType}): ${message}`);
  }
  
  throw new Error(JSON.stringify(errInfo));
}
