"use client";
import * as React from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import apiCall from "@/helper/apiBe";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  const mutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const { data } = await apiCall.post("/auth/login", {
        email,
        password,
      });
      return data;
    },
    onSuccess: (data) => {
      setIsLoading(false);
      localStorage.setItem("token", data.result.token);
      setUser({
        id: data.result.id,
        balance: data.result.balance,
        email: data.result.email,
        identificationId: data.result.identificationId,
        role: data.result.role,
        points: data.result.points,
        image: data.result.image,
      });
      if (data.result.role === "ADMIN") router.replace("/aboutHOC");
      else router.replace("/");
    },
    onError: (error: any) => {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Login failed", {
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

      if (
        error.response?.data?.error?.errors &&
        Array.isArray(error.response.data.error.errors)
      ) {
        error.response.data.error.errors.forEach((err: any) =>
          ToastContainer(err.msg),
        );
      }
    },
  });

  const handleLogin = () => mutation.mutate();

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-10 text-sm relative">
      <Image
        src="/events-background-1.jpg"
        alt="background"
        fill
        className="object-cover -z-10"
      />

      <div
        className="
          w-[95%] sm:w-[80%] md:w-[60%] 
          lg:w-1/4 xl:w-1/4
          rounded-xl shadow-2xl 
          p-4 sm:p-6 md:p-8 
          bg-[#07bbf0]/40 backdrop-blur-md 
          flex flex-col justify-center items-center gap-5 z-10
        "
      >
        <div className="text-white text-center space-y-2">
          <p className="font-medium text-3xl">Login</p>
          <p className="text-sm">Please login to explore your dream event</p>
        </div>

        {/* Social Login */}
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
          <MdOutlineEmail
            size={18}
            className="absolute left-4 top-3 text-[#06354b]/70"
          />
          <Input
            type="email"
            placeholder="Email"
            className="pl-12 py-2 sm:py-3 rounded-xl shadow-2xl border border-[#06354b] placeholder:text-[#06354b]/70 w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* --- Password --- */}
        <div className="w-full relative text-sm">
          <RiLockPasswordLine
            size={18}
            className="absolute left-4 top-3 text-[#06354b]/70"
          />
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="Password"
            className="pl-12 py-2 sm:py-3 rounded-xl shadow-2xl border border-[#06354b] placeholder:text-[#06354b]/70 w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-0 text-[#06354b]/70"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </div>

        <div className="w-full flex justify-end text-sm text-white">
          <Link href="/forgot-password" className="underline">
            Forgot your password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full p-3 bg-[#06354b] rounded-xl shadow-2xl font-medium text-white"
        >
          LOGIN
        </Button>

        <p className="text-white text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/Authen/register" className="underline">
            Register Now
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
