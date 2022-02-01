import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaArrowDown, FaArrowRight, FaArrowUp } from 'react-icons/fa';
import ListingItem from '../components/ListingItem';
import { useDispatch, useSelector } from 'react-redux';
import { toggle, personalDetailsToggle } from '../store/uiSlice';
import { getprofileListing } from '../store/listingsAction';
import { profileListing } from '../store/listingSlice';
import { changePersonalDetails } from '../store/formAction';
import { createAccount, isLogin } from '../store/formSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const showListings = useSelector((state) => state.ui.showMyListings);
  const editPersonal = useSelector((state) => state.ui.personal);
  const isLoading = useSelector((state) => state.listing.isLoadingProfile);
  const listings = useSelector((state) => state.listing.profileListings);

  const auth = getAuth();

  useEffect(() => {
    dispatch(getprofileListing(auth.currentUser.uid));
  }, [dispatch, auth.currentUser.uid]);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = user;

  const logoutHandler = () => {
    dispatch(isLogin(null));
    dispatch(createAccount(null));
    auth.signOut();
    navigate('/');
  };

  const submitChangeHandler = async () => {
    dispatch(changePersonalDetails({ auth: auth, name: name }));
  };

  const onChangeHandler = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const checkListingsHandler = () => {
    dispatch(toggle());
  };

  const deleteHandler = (id, name) => {
    if (window.confirm(`Apa kamu yakin ingin menghapus iklan ${name} ?`)) {
      deleteDoc(doc(db, 'listings', id));
      const deletedListings = listings.filter((listing) => listing.id !== id);
      dispatch(profileListing(deletedListings));
      toast.success('Listings Deleted');
    }
  };

  const editHandler = (id) => navigate(`/profile/edit-listing/${id}`);

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
                editPersonal && submitChangeHandler();
                dispatch(personalDetailsToggle());
              }}
            >
              {editPersonal ? 'Done' : 'Edit'}
            </p>
          </div>
          <div>
            <form>
              <label htmlFor='name'>Name</label>
              <input
                onChange={onChangeHandler}
                value={name}
                className={`py-2 px-4 w-full rounded-lg ${
                  editPersonal && 'border-2'
                } font-bold focus:outline-green-600`}
                disabled={!editPersonal}
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
          to='/profile/add-listing'
        >
          <p>Punya property yang ingin disewakan ?</p>
          <FaArrowRight className='text-green-600' />
        </Link>

        <div className='flex flex-col mt-4 gap-4 shadow-lg p-4'>
          <button
            className='flex justify-between items-center font-semibold hover:text-green-600'
            onClick={checkListingsHandler}
          >
            <p>{showListings ? 'Sembunyikan' : 'Tunjukkan'} Iklan Saya</p>
            {showListings ? <FaArrowUp /> : <FaArrowDown />}
          </button>

          {showListings && (
            <>
              {isLoading ? (
                <>
                  <div className='alert alert-info mt-8'>
                    <div className='flex-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        className='w-6 h-6 mx-2 stroke-current'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        ></path>
                      </svg>
                      <label>Tunggu sebentar ya..!</label>
                    </div>
                  </div>
                </>
              ) : listings && listings.length > 0 ? (
                <>
                  <ul>
                    {listings.map((listing) => (
                      <ListingItem
                        listing={listing.data}
                        id={listing.id}
                        key={listing.id}
                        deleteHandler={deleteHandler}
                        editHandler={editHandler}
                      >
                        {listing.data.name}
                      </ListingItem>
                    ))}
                  </ul>
                </>
              ) : (
                <p>There's no such a thing</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
