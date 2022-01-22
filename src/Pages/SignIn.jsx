import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaUnlockAlt,
} from 'react-icons/fa';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { email, password } = formData;

  const formInputHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className='px-6 py-4 flex flex-col'>
        <header>
          <p className='text-3xl font-bold'>Log In To Your Account</p>
        </header>

        <form
          className='relative flex flex-col gap-4 mt-8'
          onSubmit={loginSubmit}
        >
          <div className='flex items-center gap-4'>
            <FaEnvelope />
            <input
              className='input w-full'
              type='email'
              placeholder='Email'
              id='email'
              onChange={formInputHandler}
            />
          </div>
          <div className='relative flex items-center gap-4'>
            <FaUnlockAlt />
            <input
              className='input w-full'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              id='password'
              onChange={formInputHandler}
            />
            {showPassword ? (
              <FaEye
                className='absolute right-5 top-4 cursor-pointer'
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <FaEyeSlash
                className='absolute right-5 top-4 cursor-pointer'
                onClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          </div>

          <Link
            className='font-bold text-green-600 self-end mr-4'
            to='/forgot-password'
          >
            Forgot password ?
          </Link>

          <div className='flex justify-between items-center mt-4'>
            <p className='font-bold text-xl'>Sign In</p>
            <button className='p-4 bg-green-600 rounded-full active:scale-95'>
              <FaArrowRight className='text-white' />
            </button>
          </div>
        </form>

        <Link
          className='text-green-600 font-bold self-center mt-8'
          to='/sign-up'
        >
          Don't have an account yet ? Join us!
        </Link>
      </div>
    </>
  );
};

export default SignIn;
