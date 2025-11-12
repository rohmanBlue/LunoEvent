"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Event = {
  id: number;
  title: string;
  description: string;
  ticketType: string; 
  totalSeats: number;
  images: { path: string }[];
  price: number;
  startTime: string;
  endTime: string;
  location: { locationName: string };
};

type Category = {
  id: number;
  categoryName: string;
  event: Event[];
};

export default function EventPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 6;
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/category/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  const allEvents = categories.flatMap((c) => c.event);
  const filteredEvents =
    currentCategory !== null
      ? categories.find((c) => c.id === currentCategory)?.event || []
      : allEvents;

  const totalPages = Math.ceil(filteredEvents.length / perPage);
  const displayed = filteredEvents.slice((page - 1) * perPage, page * perPage);

  // Helper untuk menentukan alert status
 const getEventStatus = (ev: Event) => {
  const now = new Date();
  const start = new Date(ev.startTime);
  const end = new Date(ev.endTime);
  const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (ev.totalSeats <= 0) {
    return {
      color: "bg-red-500 text-white",
      text: "Tiket habis",
    };
  } else if (now > end) {
    return {
      color: "bg-red-500 text-white",
      text: "Waktu habis",
    };
  } else if (ev.totalSeats < 20) {
    return {
      color: "bg-pink-300 text-pink-800",
      text: "Tiket mau habis",
    };
  } else if (diffDays <= 3) {
    return {
      color: "bg-pink-300 text-pink-800",
      text: "Waktu mau habis",
    };
  } else if (diffDays <= 2 && ev.ticketType === "PAID") {
    return {
      color: "bg-purple-300 text-purple-800",
      text: `Tiket akan tersedia ${diffDays === 1 ? "esok hari" : "lusa"}`,
    };
  } else {
    return {
      color: "bg-green-300 text-green-800",
      text: "Tiket tersedia",
    };
  }
};

   return (
    <div className="flex-1 min-h-screen p-6 sm:p-10 md:p-10 lg:p-10 xl:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Judul */}
        <p className="text-3xl sm:text-3xl md:text-4xl font-medium pb-6 sm:pb-8 text-center text-[#06354b] mt-10">
          Categories
        </p>

        {/* Tombol kategori */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-0 pb-8">
          {categories.map((c: any) => (
            <Button
              key={c.id}
              onClick={() => {
                setCurrentCategory(c.id);
                setPage(1);
              }}
              className={`px-3 md:px-4 py-1 md:py-2 font-semibold transition-transform text-sm md:text-base rounded-full ${
                currentCategory === c.id
                  ? "bg-[#06354b] text-[#e6f7ff] hover:scale-105"
                  : "bg-[#e6f7ff]/60 text-[#06354b] border border-[#06354b]/40 hover:scale-105"
              }`}
            >
              {c.categoryName}
            </Button>
          ))}
        </div>

        {/* Kartu event */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px] sm:min-h-[600px] md:min-h-[800px] lg:min-h-[900px]">
          {displayed.length > 0 ? (
            displayed.map((e: any) => {
              const imgUrl = e.images?.[0]?.path
                ? `http://localhost:8000${e.images[0].path}`
                : "/aespa.webp";
              const status = getEventStatus(e);

              return (
                <div
                  key={e.id}
                  className="rounded-xl border border-[#06354b]/20 bg-[#e6f7ff]/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3 cursor-pointer h-[420px] sm:h-[440px]"
                  onClick={() => router.push(`/eventSERP/${e.id}`)}
                >
                  <div className="relative w-full h-52 sm:h-56 md:h-64 rounded-xl overflow-hidden border border-[#06354b]/40 bg-[#e6f7ff]/20 shadow-md flex items-center justify-center">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={e.title || "event"}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        onError={(err) => {
                          err.currentTarget.src = "/aespa.webp";
                        }}
                      />
                    ) : (
                      <span className="text-gray-800 text-sm">No Image</span>
                    )}
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 text-[10px] sm:text-xs font-semibold rounded ${status.color}`}
                    >
                      {String(status.text)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm sm:text-base truncate text-[#06354b]">
                        {e.title}
                      </p>
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#06354b]/10 text-[#06354b] border border-[#06354b]/20">
                        {e.ticketType || "FREE"}
                      </span>
                    </div>

                    <p className="font-medium text-xs sm:text-sm truncate text-[#06354b]/80 line-clamp-1">
                      deskripsi: {e.description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      lokasi: {e.location?.locationName || "-"}
                    </p>

                    <div className="mt-1 text-xs text-gray-700 leading-relaxed">
                      <div>
                        Start:{" "}
                        {new Date(e.startTime).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                      <div>
                        End:{" "}
                        {new Date(e.endTime).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                      <div className="mt-1">
                        Price:{" "}
                        {e.price > 0
                          ? `Rp${Number(e.price).toLocaleString("id-ID")}`
                          : "FREE"}
                      </div>
                      <div>Total Seats: {Number(e.totalSeats ?? 0)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-600 text-sm py-10">
              Belum ada event.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredEvents.length > perPage && (
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page <= 1}
              className="h-9 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                variant={p === page ? "default" : "outline"}
                className={`h-9 px-3 text-sm transition-all duration-150 ${
                  p === page
                    ? "bg-[#06354b] text-white hover:bg-[#074665]"
                    : "hover:bg-[#06354b]/10"
                }`}
              >
                {p}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages}
              className="h-9 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}