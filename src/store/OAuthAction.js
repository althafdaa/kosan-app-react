import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import { isLogin } from './formSlice';

export const googleOAuth = ({ auth, provider }) => {
  return async (dispatch) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      dispatch(isLogin(true));
      toast.success(`Login berhasil welcome ${user.displayName}`);
    } catch (error) {
      toast.error('Something went wrong');
      dispatch(isLogin(false));
    }
  };
};
