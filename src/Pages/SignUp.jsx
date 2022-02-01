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
import { useSelector, useDispatch } from 'react-redux';
import { showPassword } from '../store/uiSlice';
import { createAccountHandler } from '../store/formAction';

const SignUp = () => {
  const dispatch = useDispatch();
  const togglePassword = useSelector((state) => state.ui.showPassword);
  const accountCreated = useSelector((state) => state.form.accCreated);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const formInputOnchange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const formHandler = async (e) => {
    e.preventDefault();

    dispatch(
      createAccountHandler({
        email: email,
        password: password,
        name: name,
      })
    );
  };

  if (accountCreated) {
    navigate('/');
  }

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
              onChange={formInputOnchange}
            />
          </div>
          <div className='flex items-center gap-4'>
            <FaEnvelope />
            <input
              className='input w-full'
              type='email'
              placeholder='Email'
              id='email'
              onChange={formInputOnchange}
            />
          </div>
          <div className='relative flex items-center gap-4'>
            <FaUnlockAlt />
            <input
              className='input w-full'
              type={togglePassword ? 'text' : 'password'}
              placeholder='Password'
              id='password'
              onChange={formInputOnchange}
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
