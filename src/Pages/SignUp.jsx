import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaUnlockAlt,
} from 'react-icons/fa';
import { ReactComponent as Register } from '../assets/register.svg';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { showPassword } from '../store/uiSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const togglePassword = useSelector((state) => state.ui.showPassword);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const formInputHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const formHandler = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const dataCopy = { ...formData };
      delete dataCopy.password;
      dataCopy.timestamp = serverTimestamp();

      // add the data to firestore
      await setDoc(doc(db, 'users', user.uid), dataCopy);
      navigate('/');
      toast.success(
        `Account Created Welcome ${userCredentials.user.displayName}`
      );
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <div className='px-6 py-4 flex flex-col'>
        <header>
          <p className='text-3xl font-bold'>Register Your Account</p>
        </header>

        <Register
          className='self-center mt-12 shadow-md'
          height='240px'
          width='240px'
        />

        <form
          className='relative flex flex-col gap-4 mt-8'
          onSubmit={formHandler}
        >
          <div className='flex items-center gap-4'>
            <FaUser />
            <input
              className='input w-full'
              type='text'
              placeholder='Name'
              id='name'
              onChange={formInputHandler}
            />
          </div>
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
              type={togglePassword ? 'text' : 'password'}
              placeholder='Password'
              id='password'
              onChange={formInputHandler}
            />
            {togglePassword ? (
              <FaEye
                className='absolute right-5 top-4 cursor-pointer'
                onClick={() => dispatch(showPassword())}
              />
            ) : (
              <FaEyeSlash
                className='absolute right-5 top-4 cursor-pointer'
                onClick={() => dispatch(showPassword())}
              />
            )}
          </div>

          <div className='flex justify-between items-center mt-4'>
            <p className='font-bold text-xl'>Sign Up</p>
            <button className='p-4 bg-green-600 rounded-full active:scale-95'>
              <FaArrowRight className='text-white' />
            </button>
          </div>
        </form>

        <Link
          className='text-green-600 font-bold self-center mt-8'
          to='/sign-in'
        >
          Have an account already ? Sign in
        </Link>
      </div>
    </>
  );
};

export default SignUp;
