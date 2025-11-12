"use client";

import React, { useEffect, useState } from "react";
import api from "@/helper/apiBe";
import withRole from "@/hoc/roleGuard"; // HOC cek role
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";

type BalanceData = {
  balance: number;
  points: number;
};

const AdminBalance = () => {
  const { user } = useUser();
  const [data, setData] = useState<BalanceData>({ balance: 0, points: 0 });
  const [topupAmount, setTopupAmount] = useState<number>(0);
  const [referralCode, setReferralCode] = useState<string>("");
  const [pointsToBalance, setPointsToBalance] = useState<number>(0);

  // Ambil balance & points
  const fetchBalance = async () => {
    try {
      const { data } = await api.get("/balance/balance", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (data?.success)
        setData({ balance: data.result.balance, points: data.result.points });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchBalance();
  }, [user]);

  // Topup balance
  // ...import, useState, useEffect sama seperti sebelumnya

  // Topup balance
  const handleTopup = async () => {
    if (topupAmount < 10000 || topupAmount > 1000000) {
      return alert("Topup minimal 10.000 dan maksimal 1.000.000");
    }

    try {
      const { data: res } = await api.post(
        "/balance/balance",
        { balance: topupAmount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res.success) {
        setData({ balance: res.result.balance, points: res.result.points });
        alert(`Topup berhasil! Saldo +${topupAmount} dan point +20`);
        setTopupAmount(0);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Topup gagal");
    }
  };

  // Points -> Balance
  const handlePointsToBalance = async () => {
    if (pointsToBalance < 10000 || pointsToBalance > 1000000)
      return alert("Minimal 10.000 dan maksimal 1.000.000 points");

    try {
      const { data: res } = await api.post(
        "/balance/balance",
        { points: pointsToBalance },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (res.success) {
        setData({ balance: res.result.balance, points: res.result.points });
        alert(
          `Berhasil menukar ${pointsToBalance} points menjadi balance Rp ${pointsToBalance.toLocaleString()}`,
        );
        setPointsToBalance(0);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Tukar points gagal");
    }
  };
return (
    <div className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:px-0 max-w-lg mx-auto min-h-screen flex flex-col gap-6 transition-all duration-300">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-center text-[#06354b]">
        Balance & Points
      </h1>

      {/* Info Balance */}
      <div className="bg-[#e6f7ff]/40 border border-[#06354b]/20 rounded-lg p-4 sm:p-5 md:p-6 shadow flex flex-col gap-2">
        <p className="text-base sm:text-lg font-medium text-[#06354b]">
          Balance: Rp {data.balance.toLocaleString()}
        </p>
        <p className="text-base sm:text-lg font-medium text-[#06354b]">
          Points: {data.points}
        </p>
      </div>

      {/* Topup */}
      <div className="bg-[#e6f7ff]/40 border border-[#06354b]/20 rounded-lg p-4 sm:p-5 md:p-6 flex flex-col gap-2 shadow">
        <p className="font-semibold text-sm sm:text-base text-[#06354b]">
          Topup Balance (point otomatis +20) Min 10.000 & Max 1.000.000
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            placeholder="Masukkan jumlah topup"
            value={topupAmount}
            onChange={(e) => setTopupAmount(Number(e.target.value))}
            className="border p-2 sm:p-3 rounded w-full border-[#06354b]/60 text-[#06354b] focus:ring-2 focus:ring-[#06354b]/50 outline-none"
          />
          <Button
            onClick={handleTopup}
            className="p-2 sm:p-3 border border-[#06354b]/60 bg-[#06354b]/80 hover:bg-[#06354b] text-[#e6f7ff] rounded-md"
          >
            Topup
          </Button>
        </div>
      </div>

      {/* Points -> Balance */}
      <div className="bg-[#e6f7ff]/40 border border-[#06354b]/20 rounded-lg p-4 sm:p-5 md:p-6 flex flex-col gap-2 shadow">
        <p className="font-semibold text-sm sm:text-base text-[#06354b]">
          Tukar Points menjadi Balance (min 10.000 & max 1.000.000)
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            placeholder="Masukkan jumlah points"
            value={pointsToBalance}
            onChange={(e) => setPointsToBalance(Number(e.target.value))}
            className="border p-2 sm:p-3 rounded w-full border-[#06354b]/60 text-[#06354b] focus:ring-2 focus:ring-[#06354b]/50 outline-none"
          />
          <Button
            onClick={handlePointsToBalance}
            className="p-2 sm:p-3 border border-[#06354b]/60 bg-[#06354b]/80 hover:bg-[#06354b] text-[#e6f7ff] rounded-md"
          >
            Tukar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withRole(AdminBalance, 'USER'); 