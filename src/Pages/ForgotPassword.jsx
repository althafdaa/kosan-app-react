import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { FaEnvelope, FaCheckSquare } from 'react-icons/fa';
import { ReactComponent as ForgotPass } from '../assets/forget-password.svg';
import { ReactComponent as ForgotPassSent } from '../assets/forget-password-sent.svg';
import { useDispatch, useSelector } from 'react-redux';
import { isSubmitted } from '../store/uiSlice';
import { setEmail } from '../store/formSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const formSubmitted = useSelector((state) => state.ui.isSubmitted);
  const email = useSelector((state) => state.form.email);

  const auth = getAuth();

  const emailOnchange = (e) => {
    dispatch(
      setEmail({
        email: e.target.value,
      })
    );
  };

  const emailSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      dispatch(isSubmitted());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='px-6 py-4 flex flex-col gap-4'>
      <header>
        <h1 className='text-2xl font-bold'>Forgot Password</h1>
      </header>
      {formSubmitted ? (
        <div className='flex flex-col gap-4 items-center'>
          <ForgotPassSent height='240px' width='240px' />
          <div className='flex items-center'>
            <p className='text-3xl font-bold text-green-600'>Email was sent</p>
            <FaCheckSquare className='ml-4 text-green-600' size={36} />
          </div>
          <p className='text-neutral-focus'>
            Please kindly check your inbox message or spam
          </p>
        </div>
      ) : (
        <>
          <ForgotPass className='self-center' height='240px' width='240px' />
          <main className='flex flex-col'>
            <p className='text-lg'>
              We will send your new credentials to your email address
            </p>
            <div className='shadow-lg rounded-lg p-4'>
              <form onSubmit={emailSubmitHandler}>
                <div className='flex items-center gap-4'>
                  <FaEnvelope />
                  <input
                    className='py-2 px-4 w-full rounded-lg border-2 focus:outline-green-600'
                    placeholder='Input your email Address'
                    type='email'
                    id='email'
                    value={email}
                    onChange={emailOnchange}
                  />
                </div>
                <button className='py-2 px-4 w-full mt-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 active:scale-95'>
                  Recover your Password
                </button>
              </form>
            </div>
            <Link
              className='mt-4 self-end font-bold text-green-600'
              to='/sign-in'
            >
              or go to Login Page
            </Link>
          </main>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
