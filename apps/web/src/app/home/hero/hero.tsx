"use client";
import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

const Hero: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // debounce search
  const handleSearchChange = useMemo(() => {
    return debounce(async (query: string) => {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        setLoading(true);
        await router.push(
          `/eventSearch?searchTerm=${encodeURIComponent(trimmedQuery)}`
        );
        setLoading(false);
      }
    }, 1000);
  }, [router]);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchTerm(value);
      handleSearchChange(value);
    },
    [handleSearchChange]
  );

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <Image
        src="/narthan.gif"
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />

      {/* Content Center */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
        <div className="backdrop-blur-md bg-[#e6f7ff]/60 border border-[#06354b]/40 rounded-2xl shadow-2xl p-6 md:p-10 max-w-md w-full">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#06354b] pb-8">
            Discovery 
          </h1>

          <div className="flex flex-col items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search event"
              className="w-full py-2 rounded-full border bg-[#effaff]/60 border-[#06354b]/40 focus:outline-none focus:ring-2 focus:ring-[#06354b]/20 text-gray-950 placeholder-gray-600 px-4"
            />
            <button className="bg-[#b8edff]/40 px-3 py-2 rounded-lg hover:bg-[#b8edff] border border-[#06354b]/40 transition-all">
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Marquee (infinity) */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-[#06354b]/60 backdrop-blur-md overflow-hidden flex items-center">
        <div className="whitespace-nowrap animate-marquee text-[#e6f7ff]/80 text-base md:text-lg tracking-wider px-6">
          Book now and unlock exclusive deals on the world’s most unforgettable
          events — limited-time offers await!
        </div>
      </div>

      {/* Marquee duplicate for seamless loop */}
      <div className="absolute bottom-0 left-full w-full h-10 bg-[#06354b]/60 backdrop-blur-md overflow-hidden flex items-center">
        <div className="whitespace-nowrap animate-marquee text-[#e6f7ff]/80 text-base md:text-lg tracking-wider px-6">
          Book now and unlock exclusive deals on the world’s most unforgettable
          events — limited-time offers await!
        </div>
      </div>
    </div>
  );
};

export default Hero;
