import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import { createAccount, isLogin } from './formSlice';

export const changePersonalDetails = (data) => {
  return async () => {
    const { auth, name } = data;
    try {
      if (auth.currentUser.displayName !== name) {
        // update in firebase/auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
};

export const logInSubmitHandler = (data) => {
  const { auth, email, password } = data;
  return async (dispatch) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        dispatch(isLogin(true));
        toast.success(
          `Login Succeed Welcome ${userCredentials.user.displayName}`
        );
      }
    } catch (error) {
      dispatch(isLogin(null));
      toast.error('Wrong email/password');
      console.log(error);
    }
  };
};

export const createAccountHandler = (data) => {
  const auth = getAuth();
  const { email, password, name } = data;
  return async (dispatch) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const dataCopy = { ...data };
      delete dataCopy.password;
      dataCopy.timestamp = serverTimestamp();

      // add the data to firestore
      await setDoc(doc(db, 'users', user.uid), dataCopy);
      dispatch(createAccount(true));
      toast.success(
        `Account Created Welcome ${userCredentials.user.displayName}`
      );
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
};
