import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="bg-gray-800 bg-opacity-80 py-2 px-28"> 
      <footer className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
        <p className="text-sm text-gray-100">
          © 2024 treeFy.Inc All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6 mt-2 sm:mt-0">
          <a
            className="text-sm text-gray-100 hover:underline"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-sm text-gray-100 hover:underline"
            href="#"
          >
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
 };

 export default Footer;
  