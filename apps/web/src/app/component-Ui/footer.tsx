import React from "react";

const Footer: React.FC = () => (
  <div className="bg-[#06354b]">
  <footer className="w-full bg-[#06354b]/60 text-[#e6f7ff] backdrop-blur-md py-2">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 text-center sm:text-left gap-3">
      <p className="text-sm">
        ©2025 LunoEvent — All rights reserved
      </p>

      <nav className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm">
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
        <a href="#" className="hover:underline">
          Privacy
        </a>
      </nav>
    </div>
  </footer> </div>
);

export default Footer;
