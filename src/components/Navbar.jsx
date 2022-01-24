import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaHeart, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const MatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className='mt-auto inset-x-0'>
      <nav className='bg-base-200 py-4'>
        <ul className='flex justify-around'>
          <li
            className={`flex flex-col items-center cursor-pointer hover:text-green-600
            ${MatchRoute('/') ? 'text-green-600' : ''}
            `}
            onClick={() => navigate('/')}
          >
            <FaSearch className='text-2xl' />
            <p className={`text-lg ${MatchRoute('/') ? 'font-bold' : ''}`}>
              Explore
            </p>
          </li>
          <li
            className={`flex flex-col items-center cursor-pointer hover:text-green-600
            ${MatchRoute('/discount') ? 'text-green-600' : ''}
            `}
            onClick={() => navigate('/discount')}
          >
            {' '}
            <FaHeart className='text-2xl' />
            <p
              className={`text-lg ${
                MatchRoute('/discount') ? 'font-bold' : ''
              }`}
            >
              Discount
            </p>
          </li>
          <li
            className={`flex flex-col items-center cursor-pointer hover:text-green-600
            ${MatchRoute('/profile') ? 'text-green-600' : ''}
            `}
            onClick={() => navigate('/profile')}
          >
            {' '}
            <FaHome className='text-2xl' />
            <p
              className={`text-lg ${MatchRoute('/profile') ? 'font-bold' : ''}`}
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Navbar;
