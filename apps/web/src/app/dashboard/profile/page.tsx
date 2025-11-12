"use client";

import React, { useEffect, useState } from "react";
import api from "@/helper/apiBe";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAllRole from "@/hoc/allRole";

interface UserProfile {
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  location: string;
  image?: string;
  email: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
    phoneNumber: "",
    dateOfBirth: "",
    location: "",
    image: "",
    email: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  // GET profile
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success && data.result) {
          const res = data.result;
          setUser({
            firstName: res.firstName || "",
            lastName: res.lastName || "",
            address: res.address || "",
            gender: res.gender || "",
            phoneNumber: res.phoneNumber || "",
            dateOfBirth: res.dateOfBirth?.split("T")[0] || "",
            location: res.location?.locationName || "",
            image: res.image || "",
            email: res.user?.email || "",
          });
          toast.success("Get sukses", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (err: any) {
        console.error(err);
        toast.error("Get failed", { position: "top-right", autoClose: 3000 });
      }
    };
    fetchProfile();
  }, [token]);

  // UPDATE profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    formData.append("firstName", user.firstName || "");
    formData.append("lastName", user.lastName || "");
    formData.append("address", user.address || "");
    formData.append("gender", user.gender || "");
    formData.append("phoneNumber", user.phoneNumber || "");
    formData.append("dateOfBirth", user.dateOfBirth || "");
    formData.append("location", user.location || "");
    if (imageFile) formData.append("img", imageFile);

    try {
      await api.patch("user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Update sukses", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Update failed", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-lg bg-[#e6f7ff]/60 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col gap-6 border border-[#06354b]/20 mt-24">
        <h1 className="text-3xl sm:text-3xl font-semibold text-center text-[#06354b]">
          Update Profile
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            readOnly
            className="border p-2 rounded w-full bg-gray-100 text-black"
          />
          <input
            type="text"
            placeholder="First Name"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Address"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
          />
          <select
            value={user.gender}
            onChange={(e) => setUser({ ...user, gender: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <input
            type="text"
            placeholder="Phone Number"
            value={user.phoneNumber}
            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="date"
            value={user.dateOfBirth}
            onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Location"
            value={user.location || " "}
            onChange={(e) => setUser({ ...user, location: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
            className="border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-300"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-3 rounded-lg font-medium transition-all duration-200 w-full shadow-md hover:shadow-lg"
          >
            Update Profile
          </button>
        </form>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
};

export default withAllRole(Profile, ["ADMIN", "USER"]);
