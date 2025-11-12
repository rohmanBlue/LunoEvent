"use client";
import * as React from "react";
import { MdOutlineEmail } from "react-icons/md";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaUserFriends,
} from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import apiCall from "@/helper/apiBe";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const Register: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [refCode, setRefCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [role, setRole] = React.useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.post("/auth/register", {
        email,
        password,
        confirmPassword,
        refCode,
        role,
      });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.result.token);
      router.replace("/");
      if (data.result.role === "ADMIN") router.replace("/aboutHOC");
      else router.replace("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed", {
        position: "top-right", // tetap top-right sebagai acuan
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          marginTop: "60px", // turun dari atas
          marginRight: "20px", // ke kanan sedikit
          borderRadius: "10px",
          fontSize: "14px",
        },
      });
    },
  });

  const handleSubmit = () => mutation.mutate();

  return (
    <div
      className="
        relative w-full h-screen 
        flex flex-col justify-center items-center
        text-sm overflow-hidden text-[#06354b]
        md:flex md:justify-center p-2 
      "
    >
      <Image
        src="/events-background-1.jpg"
        alt="background"
        fill
        className="object-cover -z-10"
      />

      <div
        className="
  w-[95%] sm:w-[85%] md:w-[60%]
  lg:w-[35%] xl:w-[25%]
  rounded-xl shadow-2xl 
  p-4 sm:p-6 md:p-10
  bg-[#07bbf0]/40 backdrop-blur-md 
  flex flex-col justify-center items-center gap-5 z-10
  mx-auto xl:mt-24 mt-24
  min-h-[60vh] sm:min-h-[70vh]
  max-h-[90vh]
  transition-all duration-300 ease-in-out
  "
      >
        <div className="text-center text-white space-y-2">
          <p className="font-medium text-2xl sm:text-3xl md:text-3xl pb-2">
            Register
          </p>
          Please register to explore your dream event
        </div>

        {/* --- Social Buttons --- */}
        <div className="w-full flex flex-col gap-3">
          <button className="w-full p-3 bg-red-900 text-white rounded-xl shadow-2xl flex justify-center items-center gap-2 font-medium border border-[#e6f7ff]/40">
            <FaGoogle size={18} /> Login with Google
          </button>
          <button className="w-full p-3 bg-blue-900 text-white rounded-xl shadow-2xl flex justify-center items-center gap-2 font-medium border border-[#e6f7ff]/40">
            <FaFacebookF size={18} /> Login with Facebook
          </button>
        </div>
        <div className="flex items-center justify-center w-full my-2 text-[#e6f7ff]">
          <div className="flex-1 h-px bg-[#e6f7ff]" />
          <span className="px-2 text-xs sm:text-sm">or</span>
          <div className="flex-1 h-px bg-[#e6f7ff]" />
        </div>

        {/* --- Email --- */}
        <div className="w-full relative">
          <MdOutlineEmail size={18} className="absolute left-4 top-3" />
          <Input
            type="email"
            placeholder="Email"
            className="pl-12 py-2 sm:py-3 rounded-xl shadow-2xl border border-[#06354b] placeholder:text-[#06354b]/70"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* --- Password --- */}
        <div className="w-full relative ">
          <RiLockPasswordLine size={18} className="absolute left-4 top-3" />
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="Password"
            className="pl-12 py-2 sm:py-3 rounded-xl shadow-2xl border border-[#06354b] placeholder:text-[#06354b]/70"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-0"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </div>

        {/* --- Confirm Password --- */}
        <div className="w-full relative">
          <RiLockPasswordLine size={18} className="absolute left-4 top-3" />
          <Input
            type={isConfirmVisible ? "text" : "password"}
            placeholder="Confirm Password"
            className="pl-12 py-2 sm:py-3 rounded-xl shadow-2xl border border-[#06354b] placeholder:text-[#06354b]/70"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-0"
            onClick={() => setIsConfirmVisible(!isConfirmVisible)}
          >
            {isConfirmVisible ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </div>

        {/* --- Referral --- */}
        <div className="w-full relative">
          <FaUserFriends size={18} className="absolute left-4 top-3" />
          <Input
            type="text"
            placeholder="Referral Code (optional)"
            className="pl-12 py-2 sm:py-3 rounded-xl shadow-2xl border border-[#06354b] placeholder:text-[#06354b]/70"
            onChange={(e) => setRefCode(e.target.value)}
          />
        </div>

        {/* --- Role --- */}
        <div className="text-white font-bold w-full flex flex-col items-center">
          <RadioGroup onValueChange={(value) => setRole(value)}>
            <div className="flex justify-center items-center gap-3 py-1">
              <RadioGroupItem value="USER" />
              <Label>User</Label>
            </div>
            <div className="flex justify-center items-center gap-3 py-1">
              <RadioGroupItem value="ADMIN" />
              <Label>Organizer</Label>
            </div>
          </RadioGroup>
        </div>

        {/* --- Submit --- */}
        <Button
          onClick={handleSubmit}
          className="w-full py-2 sm:py-3 bg-[#06354b] text-white font-medium rounded-xl shadow-2xl"
        >
          REGISTER
        </Button>

        {/* --- Link --- */}
        <p className="text-white text-xs sm:text-sm">
          Already have an account?{" "}
          <Link href="/Authen/login" className="underline font-semibold">
            Login Now
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
