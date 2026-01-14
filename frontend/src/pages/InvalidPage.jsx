import React from 'react';
import { useNavigate } from 'react-router-dom';

const InvalidPage = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <h1 className='text-9xl font-bold text-primary mb-4'>404</h1>
        <h2 className='text-3xl font-semibold text-gray-800 mb-4'>
          Page Not Found
        </h2>
        <p className='text-gray-600 mb-8 max-w-md mx-auto'>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className='bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors'
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default InvalidPage;
