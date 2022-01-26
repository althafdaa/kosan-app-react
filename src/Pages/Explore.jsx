import React from 'react';
import { Link } from 'react-router-dom';
import kosanImage from '../assets/kosan.jpg';
import apartImage from '../assets/apart.jpg';
import { useAuthStats } from '../Hooks/useAuthStats';
import { getAuth } from 'firebase/auth';
import BecomeUser from '../components/BecomeUser';
import LatestListing from '../components/LatestListing';

const Explore = () => {
  const auth = getAuth();
  const { isLoggedIn } = useAuthStats();

  return (
    <div className='py-4 px-6 grid gap-4'>
      <header>
        <h1 className='font-bold text-3xl'>Explore</h1>
        <LatestListing />
      </header>

      <main>
        <p>Halo {isLoggedIn ? auth.currentUser.displayName : 'sobat'},</p>
        <p className='text-lg font-semibold'>Lagi cari apa nih ?</p>

        <div className='flex gap-4'>
          <Link
            className='shadow-lg py-4 pb-0 rounded-lg hover:-translate-y-1 w-1/2 h-full'
            to='/type/kosan'
          >
            <img
              className='rounded-t-lg w-full'
              src={kosanImage}
              alt='Kos-kosan'
            />
            <p className='px-4 py-2'>Kos-Kosan</p>
          </Link>
          <Link
            className='shadow-lg py-4 pb-0 rounded-lg hover:-translate-y-1 w-1/2'
            to='/type/apartement'
          >
            <img className='rounded-t-lg' src={apartImage} alt='Apartemen' />
            <p className='px-4 py-2'>Apartemen</p>
          </Link>
        </div>

        <BecomeUser />
      </main>
    </div>
  );
};

export default Explore;
