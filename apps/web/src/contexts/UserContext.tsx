"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import apiCall from "@/helper/apiBe";
import { toast } from "react-toastify";
import { UserType, UserContextType, UserProviderProps } from "./type";

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (!token) {
      setLoading(false);
      return;
    }

    const keepLogin = async () => {
      try {
        const { data } = await apiCall.get("/auth/keeplogin", {
          headers: { Authorization: `Bearer ${token}` },
        }); // ✅ CEK STRUKTUR DATA YANG DATANG
        console.log("🔍 Response keeplogin:", data);
        console.log("🔍 Result:", data?.result);
        console.log("🔍 Balance:", data?.result?.balance);
        console.log("🔍 Point:", data?.result?.point);
        console.log("🔍 ID:", data?.result?.id);

        // ✅ Pastikan response punya struktur yang benar
        if (data?.result) {
          // Update token jika ada token baru
          if (data.result.token) {
            localStorage.setItem("token", data.result.token);
          }

          // Set semua data user termasuk balance, point, id
          setUser({
            id: data.result.identificationId,
            email: data.result.email,
            name: data.result.name,
            role: data.result.role,
            image: data.result.image,
            balance: data.result.balance || 0,
            points: data.result.points || 0,
            identificationId: data.result.identificationId,
            firstName: data.result.firstName,
            lastName: data.result.lastName,
            phoneNumber: data.result.phoneNumber,
            referralCode: data.result.referralCode,
          });
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Keep login failed:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    keepLogin();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
