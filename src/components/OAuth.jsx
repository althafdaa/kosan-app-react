import React from 'react';
import { useNavigate } from 'react-router';
import { FaGoogle } from 'react-icons/fa';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

const OAuth = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const oauthHandler = async () => {
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
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-center'>or sign in with Google</p>
      <button
        className='self-center rounded-full shadow-lg'
        onClick={oauthHandler}
      >
        <FaGoogle className=' cursor-pointer hover:text-green-600' size={28} />
      </button>
    </div>
  );
};

export default OAuth;
