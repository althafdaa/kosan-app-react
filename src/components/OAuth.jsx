import React from 'react';
import { useNavigate } from 'react-router';
import { FaGoogle } from 'react-icons/fa';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { googleOAuth } from '../store/OAuthAction';
import { useDispatch, useSelector } from 'react-redux';

const OAuth = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.form.isLogin);
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const oauthHandler = async () => {
    dispatch(
      googleOAuth({
        auth: auth,
        provider: provider,
      })
    );
  };

  if (isLogin) {
    navigate('/');
  }

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-center'>atau login dengan</p>
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
