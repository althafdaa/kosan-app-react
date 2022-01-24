import React, { useState } from 'react';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaArrowRight } from 'react-icons/fa';

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [personalDetails, setPersonalDetails] = useState(false);
  const [user, setUser] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = user;

  const logoutHandler = () => {
    auth.signOut();
    navigate('/');
  };

  const submitChangeHandler = async () => {
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

  const onChangeHandler = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className='px-6 py-4 flex flex-col gap-8'>
      <header>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <button
            className='py-1 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 active:scale-95'
            onClick={logoutHandler}
          >
            Log Out
          </button>
        </div>
      </header>
      <main>
        <div className='p-4 rounded-lg shadow-md flex flex-col gap-2'>
          <div className='flex justify-between'>
            <p className='text-lg font-bold'>Personal Details</p>
            <p
              className='cursor-pointer text-green-600 font-bold'
              onClick={() => {
                personalDetails && submitChangeHandler();
                setPersonalDetails((prev) => !prev);
              }}
            >
              {personalDetails ? 'Done' : 'Edit'}
            </p>
          </div>
          <div>
            <form>
              <label htmlFor='name'>Name</label>
              <input
                onChange={onChangeHandler}
                value={name}
                className={`py-2 px-4 w-full rounded-lg ${
                  personalDetails && 'border-2'
                } font-bold focus:outline-green-600`}
                disabled={!personalDetails}
                type='text'
                id='name'
              />
              <label htmlFor='email'>Email</label>
              <input
                className='py-2 px-4 w-full rounded-lg font-bold mt-2 focus:outline-green-600'
                disabled
                type='text'
                id='email'
                value={email}
              />
            </form>
          </div>
        </div>

        <Link
          className='flex justify-between items-center p-4 mt-4 shadow-lg  font-semibold'
          to='/add-listing'
        >
          {' '}
          <p>Punya property yang ingin disewakan ?</p>
          <FaArrowRight className='text-green-600' />
        </Link>
      </main>
    </div>
  );
};

export default Profile;
