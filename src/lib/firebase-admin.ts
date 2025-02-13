import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Helper function to format private key
const formatPrivateKey = (key: string | undefined) => {
  if (!key) throw new Error('FIREBASE_PRIVATE_KEY is not set in environment variables');
  // If the key already contains newlines, return as is
  if (key.includes('\n')) return key;
  // Add newlines to a key without them
  const header = '-----BEGIN PRIVATE KEY-----\n';
  const footer = '\n-----END PRIVATE KEY-----\n';
  const keyBody = key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  return `${header}${keyBody}${footer}`;
};

if (!process.env.FIREBASE_PROJECT_ID) 
  throw new Error('FIREBASE_PROJECT_ID is not set in environment variables');
if (!process.env.FIREBASE_CLIENT_EMAIL) 
  throw new Error('FIREBASE_CLIENT_EMAIL is not set in environment variables');

const app = !getApps().length
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
      }),
    })
  : getApps()[0];

export const adminAuth = getAuth(app);
