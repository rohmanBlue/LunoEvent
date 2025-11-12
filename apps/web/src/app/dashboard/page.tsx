"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineProfile,
  AiOutlineTransaction,
  AiOutlineUnorderedList,
  AiOutlineDollar,
  AiOutlineMail,
} from "react-icons/ai";
import withAllRole from "@/hoc/allRole";
import { useUser } from "@/contexts/UserContext";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // ✅ Loading state
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-base sm:text-xl font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  const role = user.role;

  return (
    <div className="flex flex-col items-center min-h-screen py-28 sm:py-36 md:py-40 px-4 sm:px-6 md:px-10 text-[#06354b]">
      <h1 className="text-3xl sm:text-3xl md:text-4xl font-medium mb-6 text-center">
        Dashboard Setting
      </h1>

      {/* Info user */}
      <div className="mb-8 text-xs sm:text-sm md:text-base bg-[#e6f7ff]/60 rounded-md shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-[#06354b]/20 p-3 sm:p-4 text-center">
        <span>Current Role: </span>
        <strong className="pr-1">{role}</strong>|
        <span className="pl-1">User ID:</span> {user.identificationId}
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl">

        {/* Event CRUD (ADMIN) */}
        {role === "ADMIN" && (
          <div
            onClick={() => handleNavigation("/dashboard/admin/event-CRUD")}
            className="cursor-pointer p-5 sm:p-6 bg-[#07bbf0] bg-opacity-80 rounded-md shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-[#06354b]/60 h-44 sm:h-48 flex flex-col justify-center items-center"
          >
            <AiOutlineUnorderedList className="text-5xl sm:text-6xl mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl font-medium text-center text-[#06354b]/60">
              Event CRUD
            </h2>
          </div>
        )}

        {/* Profile */}
        <div
          onClick={() => handleNavigation("/dashboard/profile")}
          className="cursor-pointer p-5 sm:p-6 bg-[#07bbf0] bg-opacity-80 rounded-md shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-[#06354b]/60 h-44 sm:h-48 flex flex-col justify-center items-center"
        >
          <AiOutlineProfile className="text-5xl sm:text-6xl mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl font-medium text-center text-[#06354b]/60">
            Profile
          </h2>
        </div>

        {/* Transaction User (USER) */}
        {role === "USER" && (
          <div
            onClick={() => handleNavigation("/dashboard/user/transaksi-saldo")}
            className="cursor-pointer p-5 sm:p-6 bg-[#07bbf0] bg-opacity-80 rounded-md shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-[#06354b]/60 h-44 sm:h-48 flex flex-col justify-center items-center"
          >
            <AiOutlineTransaction className="text-5xl sm:text-6xl mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl font-medium text-center text-[#06354b]/60">
              Transaction & Saldo
            </h2>
          </div>
        )}

        {/* Transaction Revenue (ADMIN) */}
        {role === "ADMIN" && (
          <div
            onClick={() => handleNavigation("/dashboard/admin/revenue-saldo")}
            className="cursor-pointer p-5 sm:p-6 bg-[#07bbf0] bg-opacity-80 rounded-md shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-[#06354b]/60 h-44 sm:h-48 flex flex-col justify-center items-center"
          >
            <AiOutlineDollar className="text-5xl sm:text-6xl mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl font-medium text-center text-[#06354b]/60">
              Revenue & Saldo
            </h2>
          </div>
        )}

        {/* Contact Us */}
        <div
          onClick={() => handleNavigation("/dashboard/contact")}
          className="cursor-pointer p-5 sm:p-6 bg-[#07bbf0] bg-opacity-80 rounded-md shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-[#06354b]/60 h-44 sm:h-48 flex flex-col justify-center items-center"
        >
          <AiOutlineMail className="text-5xl sm:text-6xl mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl font-medium text-center text-[#06354b]/60">
            Contact Us
          </h2>
        </div>
      </div>
    </div>
  );
};

export default withAllRole(Dashboard, ["ADMIN", "USER"]);
