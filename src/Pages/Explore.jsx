import React from 'react';
import { Link } from 'react-router-dom';
import kosanImage from '../assets/kosan.jpg';
import apartImage from '../assets/apart.jpg';
import { useAuthStats } from '../Hooks/useAuthStats';
import { getAuth } from 'firebase/auth';
import BecomeUser from '../components/BecomeUser';

const Explore = () => {
  const auth = getAuth();
  const { isLoggedIn } = useAuthStats();

  return (
    <div className='py-4 px-6 grid gap-4'>
      <header>
        <h1 className='font-bold text-3xl'>Explore</h1>
      </header>
      <main>
        {/* SLIDER HERE */}
        <div>
          <div>
            <p>Hi {isLoggedIn ? auth.currentUser.displayName : 'friends'},</p>
            <p className='text-lg'>What are you looking for ?</p>
          </div>
          <div className='flex gap-4'>
            <Link
              className='shadow-lg py-4 pb-0 rounded-lg hover:-translate-y-1'
              to='/type/kosan'
            >
              <img className='rounded-t-lg' src={kosanImage} alt='Kos-kosan' />
              <p className='px-4 py-2'>Kos-Kosan</p>
            </Link>
            <Link
              className='shadow-lg py-4 pb-0 rounded-lg hover:-translate-y-1'
              to='/type/apartement'
            >
              <img className='rounded-t-lg' src={apartImage} alt='Apartemen' />
              <p className='px-4 py-2'>Apartemen</p>
            </Link>
          </div>
        </div>
        <BecomeUser />
      </main>
    </div>
  );
};

export default Explore;
