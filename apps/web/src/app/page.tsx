"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiCall from "@/helper/apiBe";
import Hero from "./home/hero/hero";
import Footer from "./component-Ui/footer";
import EventCard from "./home/event/page";

function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);
  return (
    <div className="bg-[#b8edff] text-[#06354b] font-sans">
      <Hero />
      <EventCard />
    </div>
  );
}

export default Home;
