import React from 'react';

const LoadingScreen = () => {
  return (
    <div className='flex relative h-full items-center justify-center'>
      <div
        style={{ width: '64px', height: '64px' }}
        className='w-12 h-12 border-dashed rounded-full border-4 border-green-400 animate-spin'
      ></div>
      <div className='absolute top-0  right-0 left-0 bottom-0 bg-black opacity-50 -z-10'></div>
    </div>
  );
};

export default LoadingScreen;
