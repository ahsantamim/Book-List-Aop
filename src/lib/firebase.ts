import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyABB1u7iMm11dXKOv8gT5jrvOGOHUjXB-M",
  authDomain: "booklist-19a00.firebaseapp.com",
  projectId: "booklist-19a00",
  storageBucket: "booklist-19a00.firebasestorage.app",
  messagingSenderId: "556448717627",
  appId: "1:556448717627:web:8e6e46980ada7dfbaa351e",
  measurementId: "G-0M1WY86ZFD"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
