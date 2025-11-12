"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/helper/apiBe";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  UserCircle,
  DollarSign,
  Star,
  LogOut,
  User,
  IdCard,
} from "lucide-react";
import { MdEmail, MdNotificationImportant } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";
import { FaCode, FaPhone } from "react-icons/fa";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const { data: dataAuth } = await api.get("/auth/keeplogin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!dataAuth?.result) return;

        const { data: dataProfile } = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = dataProfile?.result;

        setUser((prev) => ({
          ...prev, // biar tidak hilang dulu
          id: dataAuth.result.id,
          email: dataAuth.result.email,
          role: dataAuth.result.role,
          balance: dataAuth.result.balance || 0,
          points: dataAuth.result.points || 0,
          identificationId: dataAuth.result.identificationId || "",
          name: dataAuth.result.name || "",
          image: dataAuth.result.image || "",
          firstName: profile?.firstName || "",
          lastName: profile?.lastName || "",
          phoneNumber: profile?.phoneNumber || "",
          referralCode: profile?.referralCode || prev?.referralCode || "",
        }));
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [token, setUser]);

  const logoutMutation = useMutation({
    mutationFn: async () => await api.post("/auth/logout"),
    onSuccess: () => {
      localStorage.removeItem("token");
      setUser(null);
      router.replace("/Authen/login");
    },
  });

  const handleLogout = () => logoutMutation.mutate();

  const bgClass =
    pathname === "/login" || pathname === "/register"
      ? "bg-transparent"
      : "bg-[#06354b]/60 backdrop-blur-md";

  return (
    <nav className={`${bgClass} fixed top-0 w-full z-50 text-[#e6f7ff]`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-5">
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-semibold tracking-wide"
        >
          Luno<span className="text-[#79dfff]">Event</span>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-[#e6f7ff]"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div
          className={`${menuOpen ? "absolute top-16 left-0 w-full bg-[#06354b]/60 backdrop-blur-md flex flex-col items-center gap-4 py-6 border-b border-[#06354b]/20" : "hidden sm:flex sm:items-center sm:gap-10"}`}
        >
          <div className="flex flex-col sm:flex-row gap-6 text-lg items-center">
            <Link
              href="/aboutHOC"
              onClick={() => setMenuOpen(false)}
              className="transition hover:text-[#79dfff]"
            >
              About us
            </Link>
            <Link
              href="/eventSERP"
              onClick={() => setMenuOpen(false)}
              className="transition hover:text-[#79dfff]"
            >
              Explore
            </Link>
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="transition hover:text-[#79dfff]"
              >
                Dashboard
              </Link>
            )}
          </div>

          {user?.email ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer w-10 h-10 relative">
                  <Image
                    src={
                      user.image
                        ? `http://localhost:8000${user.image}`
                        : "/pngegg.png"
                    }
                    alt="User Avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={5}
                className="w-80 mt-2 p-3 bg-[#06354b]/60 backdrop-blur-[40px] rounded-2xl shadow-2xl border border-white/10 text-[#e6f7ff] transition-all duration-200"
                forceMount
              >
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2">
                  <RiProfileFill size={18} /> Name:{" "}
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.name || "-"}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2">
                  <FaPhone size={18} /> Phone: {user.phoneNumber || "-"}
                </DropdownMenuItem>
                <div className="border-t border-white/10 my-2" />

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2">
                  <MdEmail size={18} /> Email: {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2">
                  <IdCard size={18} /> ID: {user.identificationId}
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2">
                  <User size={18} /> Role: {user.role}
                </DropdownMenuItem>
                <div className="border-t border-white/10 my-2" />
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2">
                  <Star size={18} /> Point:{" "}
                  {user.points?.toLocaleString() ?? "0"}
                </DropdownMenuItem>
                <DropdownMenuItem className="items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2 line-clamp-1 flex">
                  <DollarSign size={18} /> Balance:{" "}
                  {user.balance?.toLocaleString() ?? "0"}
                </DropdownMenuItem>
                <DropdownMenuItem className="items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2 line-clamp-1 flex">
                  <FaCode size={18} /> Ref Code:{" "}
                  {user.referralCode?.toLocaleString() ?? "0"}
                </DropdownMenuItem>
                <div className="border-t border-white/10 my-2" />

                <DropdownMenuItem
                  className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2 cursor-pointer"
                  onClick={() =>
                    router.push(
                      user.role === "ADMIN"
                        ? "/admin/profile"
                        : "/user/profile",
                    )
                  }
                >
                  <UserCircle size={18} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="items-center gap-2 hover:bg-white/10 rounded-md px-2 py-2 line-clamp-1 flex">
                  <MdNotificationImportant size={18} /> Notification
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-300 hover:bg-red-500/20 rounded-md px-2 py-2 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Button
                onClick={() => router.replace("/Authen/login")}
                className="flex items-center gap-2 bg-[#e6f7ff] text-sm font-medium text-[#06354b]"
              >
                <LogIn size={14} /> Login
              </Button>
              <Button
                onClick={() => router.replace("/Authen/register")}
                className="flex items-center gap-2 bg-[#79dfff] text-sm font-medium text-[#06354b]"
              >
                <UserPlus size={14} /> Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
