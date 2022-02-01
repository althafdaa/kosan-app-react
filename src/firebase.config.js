import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB736dUh35bIfvqgi93cjbziDHY1s5ajuA',
  authDomain: 'kosan-app-ccba4.firebaseapp.com',
  projectId: 'kosan-app-ccba4',
  storageBucket: 'kosan-app-ccba4.appspot.com',
  messagingSenderId: '495249547380',
  appId: '1:495249547380:web:e5b7eb5c6f25d9d0ed3121',
};

initializeApp(firebaseConfig);

export const db = getFirestore();
