"use client";
import AdminSidebar from '@/components/AdminSidebar';
import withRole from '@/hoc/roleGuard';
import * as React from 'react';



const Balance: React.FunctionComponent = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-5 ml-[25rem]">
        <div className="w-full h-auto flex flex-col gap-10">
          <div className="w-full flex-col flex justify-center items-center gap-5">
            <p className="text-5xl">Your Balance</p>
            <p className="text-5xl font-bold">Rp. 1.000.000.000</p>
          </div>
          <div className="w-full h-0.5 bg-slate-200"></div>
          <div className="w-full">
            <p className="text-3xl">Recent Transaction</p>
          </div>
          <div className="w-full">
            <div className="flex justify-between py-3 border-b">
              <p className="text-lg">#123456</p>
              <p className="text-lg">$150.00</p>
              <p className="text-lg ">Event Name</p>
              <p className="text-lg text-green-500">Completed</p>
              <p className="text-lg">Aug 12, 2024</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p className="text-lg">#345856</p>
              <p className="text-lg">$110.00</p>
              <p className="text-lg ">Event Name 2</p>
              <p className="text-lg text-green-500">Completed</p>
              <p className="text-lg">Aug 12, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRole(Balance, 'ADMIN');
