"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineProfile, AiOutlineTransaction, AiOutlineUnorderedList } from 'react-icons/ai';

const Dashboard: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-purple-50 py-10">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">~ Settings ~</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        
        <div
          onClick={() => handleNavigation('/transaction')}
          className="cursor-pointer p-6 bg-white bg-opacity-80 rounded-sm shadow-md backdrop-blur-md"
        >
          <AiOutlineTransaction className="text-6xl text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-center text-gray-700">Transaction Details</h2>
        </div>

        <div
          onClick={() => handleNavigation('/eventCheck')}
          className="cursor-pointer p-6 bg-white bg-opacity-80 rounded-sm shadow-md backdrop-blur-md"
        >
          <AiOutlineUnorderedList className="text-6xl text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-center text-gray-700">Event control </h2>
        </div>

        <div
          onClick={() => handleNavigation('/profile')}
          className="cursor-pointer p-6 bg-white bg-opacity-80 rounded-sm shadow-md backdrop-blur-md"
        >
          <AiOutlineProfile className="text-6xl text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-center text-gray-700">Profile</h2>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
