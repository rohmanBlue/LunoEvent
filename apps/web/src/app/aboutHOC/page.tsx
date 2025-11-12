"use client";
import Image from "next/image";
import * as React from "react";

const Landing: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-20 min-h-screen items-center justify-center px-4 sm:px-6 md:px-1 pt-40 pb-10">
      {/* Hero Section */}
      <div className="w-full max-w-5xl flex flex-col gap-6 sm:gap-8 items-center text-center">
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-medium leading-tight">
          Experience Events Like Never Before
        </h1>
        <p className="text-sm sm:text-base md:text-base lg:text-lg max-w-3xl">
          Your Ultimate Destination for Unforgettable Moments – Find Events That
          Inspire and Excite!
        </p>
      </div>

      {/* About Us Section */}
      <div className="w-full p-4 sm:p-6 md:p-12 flex flex-col md:flex-row items-center md:justify-between gap-8 bg-[#e6f7ff]/60 rounded-3xl mx-auto max-w-7xl border border-[#06354b]/60">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-medium mb-4 sm:mb-5">
            About LunoEvent
          </h2>
          <p className="text-sm sm:text-base md:text-base lg:text-lg leading-relaxed">
            LunoEvent is your all-in-one platform to discover, book, and
            experience events around you. From concerts, workshops, to exclusive
            meetups, we make it easy to explore unforgettable moments. Our
            mission is to bring people together and create experiences that
            inspire and excite.
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 relative w-full min-h-[200px] sm:min-h-[250px] md:min-h-[380px] lg:min-h-[380px]">
          <Image
            src="/blackpink.webp"
            alt="About LunoEvent"
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Footer / Date */}
      <div className="w-full p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">
        Since - Saturday, 10 September 2024 - Rohman, Afred Teams
      </div>
    </div>
  );
}

export default Landing;
