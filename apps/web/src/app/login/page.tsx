"use client";
import * as React from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import { UserContext } from '@/contexts/UserContext';

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { user, setUser } = React.useContext(UserContext);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const { data } = await apiCall.post('/api/auth/login', {
        email,
        password,
      });

      return data;
    },
    onSuccess: (data) => {
      setIsLoading(false);
      console.log(data.result);
      localStorage.setItem('token', data.result.token);
      setUser({
        id: data.result.id,
        balance: data.result.balance,
        email: data.result.email,
        identificationId: data.result.identificationId,
        role: data.result.role,
        points: data.result.points,
        image: data.result.image,
      });
      if (data.result.role === 'ADMIN') {
        router.replace('/');
      } else {
        router.replace('/landing');
      }
    },
    onError: (error: any) => {
      setIsLoading(false);
      console.log(error);
      toast(error.response.data.message);
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data.error.errors)
      ) {
        // Iterate over the errors array
        error.response.data.error.errors.forEach((err: any) => {
          console.log(err.msg);
          toast(err.msg);
        });
      }
    },
  });

  const handleLogin = () => {
    mutation.mutate();
  };

  React.useEffect(() => {
    console.log(user); // Logs the updated user state
  }, [user]);
  return (
    <div className="w-full h-auto flex justify-center items-center p-5">
      <Image
        layout="fill"
        src={'/events-background-1.jpg'}
        alt={'image'}
        objectFit="cover"
      />
      <div className="w-1/4 rounded-xl shadow-2xl p-5 h-auto bg-slate-200 bg-opacity-50 flex flex-col justify-center items-center gap-5 z-10">
        <ToastContainer />
        <div className="w-full h-auto flex flex-col justify-center items-center gap-3 text-white">
          <p className="font-bold text-3xl">Login Event</p>
          <p>Please login to explore your dream event</p>
        </div>
        <div className="w-full h-auto justify-center items-center flex flex-col gap-3">
          <button className="w-full h-auto p-3 bg-red-600 text-white rounded-xl shadow-2xl flex justify-center items-center gap-2 font-bold">
            <FaGoogle size={20} />
            Login with Google
          </button>
          <button className="w-full h-auto p-3 bg-blue-600 text-white rounded-xl shadow-2xl flex justify-center items-center gap-2 font-bold">
            <FaFacebookF size={20} />
            Login with Facebook
          </button>
        </div>
        <div className="w-full flex items-center justify-center my-4">
          <div className="w-full h-px bg-gray-400" />
          <span className="px-3 text-white">or</span>
          <div className="w-full h-px bg-gray-400" />
        </div>
        <div className="w-full h-auto flex relative items-center">
          <MdOutlineEmail size={30} className="absolute left-2" />
          <input
            type="email"
            className="w-full h-auto p-3 pl-14 rounded-xl shadow-2xl"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full h-auto flex relative justify-center items-center">
          <RiLockPasswordLine size={30} className="absolute left-2" />
          <input
            type={isVisible ? 'text' : 'password'}
            className="w-full h-auto p-3 pl-14 rounded-xl shadow-2xl"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? (
              <FaEyeSlash size={30} className="absolute right-3 bottom-2" />
            ) : (
              <FaEye size={30} className="absolute right-3 bottom-2" />
            )}
          </button>
        </div>
        <div className="w-full h-auto flex justify-end items-center">
          <p className="text-xl, text-white">
            <Link href="/forgot-password">forgot your password ?</Link>
          </p>
        </div>
        <div className="w-full h-auto justify-center items-center flex">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-auto p-3 bg-slate-500 rounded-xl shadow-2xl shadow-slate-400 font-bold text-white"
          >
            {isLoading ? <ClipLoader size={30} color="white" /> : 'LOGIN'}
          </button>
        </div>
        <div className="w-full h-auto justify-center items-center flex text-white">
          <p>
            Don&apos;t have an account ?{' '}
            <Link href="/register" className="underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
