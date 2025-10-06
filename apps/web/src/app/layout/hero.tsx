  "use client";
  import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';

const Hero: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();

 // Buat debounced function dan kembalikan dari useMemo
  const handleSearchChange = useMemo(() => {
    return debounce(async (query: string) => {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        setLoading(true); // show loading
        await router.push(
          `/eventSearch?searchTerm=${encodeURIComponent(trimmedQuery)}`
        );
        setLoading(false); // hide loading
      }
    }, 1000); // delay 1 detik
  }, [router]);

  // Callback untuk input change
  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchTerm(value);
      handleSearchChange(value); // sekarang sudah callable
    },
    [handleSearchChange]
  );

  return (
    <div>
      <div className="relative min-h-full">
        <Image
          src="/narthan.gif"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          className="w-full h-screen"
        />

        <div className="bg-black bg-opacity-50 flex flex-col justify-center items-center min-h-screen shadow-md">
          <div className="backdrop-blur-md flex flex-col items-center p-14 rounded-xl border-solid border-[1px] border-white shadow-xl bg-[#ffffff34]">
            <h1 className="text-gray-600 text-2xl md:text-6xl font-bold mb-12 text-center font-KalesiRoundedDemo">
              Discover event 
            </h1>

            <div className="flex flex-col items-center space-y-4">
              <input
                type="text"
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Search your event"
                className="px-10 w-96 py-2 rounded-lg border border-gray-100 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-60 text-gray-950 placeholder-gray-600 text-1xl shadow-sm" 
              />
              <button className="bg-blue-400 text-gray-800 px-6 py-3 rounded-lg hover:bg-blue-500">
                Find your next Events
              </button>
            </div>
          </div>
        </div>

        <div className="">
          <div className="overflow-hidden w-full mt-[-28px] absolute bg-gray-800 bg-opacity-80">
            <div className="animate-marquee whitespace-nowrap text-gray-400 text-xl font-KalesiRoundedDemo tracking-wider">
              Get your tickets now! Best prices available! Don&apos;t miss out
              on the world&apos;s biggest events!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
