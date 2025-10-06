"use client";
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../../components/ui/navigation-menu';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { UserContext } from '@/contexts/UserContext';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Avatar } from '../../components/ui/avatar';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useContext(UserContext);
  const [balance, setBalance] = useState<number>();
  const [id, setId] = useState<number>();
  const [point, setPoint] = useState<number>();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.post('/api/auth/logout');
      return data;
    },
    onSuccess: () => {
      localStorage.removeItem('token');
      setUser(null);
      router.replace('/login');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  useEffect(() => {
    const fetchBalance = async () => {
      // if (!user?.id) return;
      try {
        const response = await apiCall.get(`api/balance-point/user/${user?.id}`);
        setBalance(response.data.balance);
        setId(response.data.id);
      } catch (error) {
        console.log('Error fetching balance:', error);
      }
    };
    fetchBalance();
  }, [user?.id]);

  //   if (user?.email) {
  //     fetchBalance();
  //   }
  // }, [user?.email]);

  return (
    <nav
      className={`w-full ${pathname === '/login' || pathname === '/register' ? 'bg-transparent' : 'bg-white bg-opacity-80 backdrop-blur-md'} flex justify-between sticky px-28 py-2 top-0 items-center z-20`}
    >
      <div>
        <Link href="/">
          <span className="text-4xl">Luno*EVENTS</span>
        </Link>
      </div>
      <div>
        <NavigationMenu>
          <NavigationMenuList
            className={`gap-5 ${pathname !== '/login' && pathname !== '/register' ? 'text-black' : 'text-white'}`}
          >
            <NavigationMenuItem>
              <Link href="/eventSearch">
                <span className="text-2xl font-bold">Explore</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/event">
                <span className="text-2xl font-bold">Setting</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="w-[200px] flex justify-end">
        {user?.email ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-20 h-10">
                <Image
                  src={
                    user.image
                      ? `http://localhost:8000${user.image}`
                      : '/pngegg.png'
                  }
                  alt="User Avatar"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto mr-20 p-5 bg-white bg-opacity-80 backdrop-blur-md">
              <DropdownMenuItem className="text-2xl">
                Your Balance: {balance !== null ? balance : 'Loading...'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-2xl">
                Your id: {id !== null ? id : 'Loading...'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-2xl">
                Your point: {point !== null ? id : 'Loading...'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-2xl cursor-pointer hover:bg-green-200"
                onClick={() => {
                  user.role === 'ADMIN'
                    ? router.push('/admin/profile')
                    : router.push('/user/profile');
                }}
              >
                Profile
              </DropdownMenuItem>
              <div className="bg-slate-200 w-full h-0.5"></div>
              <DropdownMenuItem
                className="text-2xl cursor-pointer hover:bg-green-200"
                onClick={handleSubmit}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-5">
            <Button
              onClick={() => router.replace('/login')}
              className="bg-white text-xl"
            >
              Login
            </Button>
            <Button
              onClick={() => router.replace('/register')}
              className="bg-green-300 text-xl"
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar