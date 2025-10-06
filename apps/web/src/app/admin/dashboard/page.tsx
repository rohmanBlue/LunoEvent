"use client";
import AdminSidebar from '@/components/AdminSidebar';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import withRole from '@/hoc/roleGuard';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';


const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
  { month: 'July', desktop: 214, mobile: 140 },
  { month: 'August', desktop: 214, mobile: 140 },
  { month: 'September', desktop: 114, mobile: 140 },
  { month: 'October', desktop: 574, mobile: 140 },
  { month: 'November', desktop: 364, mobile: 100 },
  { month: 'Dese,ber', desktop: 514, mobile: 110 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

const AdminDashboard: React.FunctionComponent = (
) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-5 ml-[30rem]">
        <div className="w-full h-auto grid grid-cols-3 grid-rows-2 gap-8">
          <div className="w-full border-solid border-slate-400 border flex flex-col gap-3 p-3">
            <div className="w-full">
              <p className="text-2xl">Active Event</p>
            </div>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex justify-start items-center gap-3">
              <p className="text-6xl">0</p>
              <p className="text-xl font-bold">Event</p>
            </div>
          </div>

          <div className="w-full border-solid border-slate-400 border flex flex-col gap-3 p-3">
            <div className="w-full">
              <p className="text-2xl">Ended Event</p>
            </div>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex justify-start items-center gap-3">
              <p className="text-6xl">0</p>
              <p className="text-xl font-bold">Event</p>
            </div>
          </div>
          <div className="w-full border-solid border-slate-400 border flex flex-col gap-3 p-3">
            <div className="w-full">
              <p className="text-2xl">Total Revenue</p>
            </div>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex justify-start items-center gap-3">
              <p className="text-5xl">Rp</p>
              <p className="text-5xl">0</p>
            </div>
          </div>
          <div className="w-full border-solid border-slate-400 border flex flex-col gap-3 p-3">
            <div className="w-full">
              <p className="text-2xl"> Transaction   </p>
            </div>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex justify-start items-center gap-3">
              <p className="text-6xl"> 0   </p>
            </div>
          </div>
          <div className="w-full border-solid border-slate-400 border flex flex-col gap-3 p-3">
            <div className="w-full">
              <p className="text-2xl"> Total Tickets Sold </p>
            </div>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex justify-start items-center gap-3">
              <p className="text-6xl">0 </p>
              <p className="text-xl font-bold"> Ticket </p>
            </div>
          </div>
          <div className="w-full border-solid border-slate-400 border flex flex-col gap-3 p-3">
            <div className="w-full">
              <p className="text-2xl"> Total Attendee </p>
            </div>
            <div className="bg-slate-200 h-0.5 w-full"></div>
            <div className="w-full flex justify-start items-center gap-3">
              <p className="text-6xl"> 0 </p>
              <p className="text-xl font-bold"> Person </p>
            </div>
          </div>
        </div>
        <div className="w-full mt-32">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default withRole(AdminDashboard, 'ADMIN');
