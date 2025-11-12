"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import withAllRole from "@/hoc/allRole";
import debounce from "lodash.debounce";

type Event = {
  ticketType: string;
  location: { id: number; locationName: string };
  id: number;
  title: string;
  description: string;
  totalSeats: number;
  images: { id: number; path: string; eventId: number }[];
  price: number;
  startTime: string;
  endTime: string;
  isDeleted: boolean;
  locationName: string; 
};

type Category = {
  id: number;
  categoryName: string;
  event: Event[];
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/category/categories",
        );
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (id: number) => {
    setCurrentCategory(id);
    setCurrentPage(1);
  };

  const handleEventClick = (id: number) => {
    setLoading(false);
    window.location.href = `/eventSERP/${id}`;
  };

  // Debounce search hanya update state searchTerm tanpa pindah halaman
  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchTerm(query), 300),
    [],
  );
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch],
  );

  const allEvents = categories.flatMap((c) => c.event);
  const filteredEvents = currentCategory
    ? categories.find((c) => c.id === currentCategory)?.event || []
    : allEvents;

  // Search hanya title
  const searchedEvents = filteredEvents.filter((ev) =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginate = (events: Event[]) => {
    const start = (currentPage - 1) * eventsPerPage;
    return events.slice(start, start + eventsPerPage);
  };

  const totalPages = (events: Event[]) =>
    Math.ceil(events.length / eventsPerPage);

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
  } else if (ev.totalSeats < 5) {
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
 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex-1 min-h-screen p-4 sm:p-8 md:p-20 lg:p-36 xl:p-40 overflow-x-hidden md:mt-0 xl:mt-0 mt-20">
      <div className="max-w-7xl mx-auto">
        <p className="text-3xl sm:text-3xl md:text-4xl font-medium pb-6 sm:pb-8 text-center text-[#06354b] mt-4">
          Search
        </p>

        {/* Search Input */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search for an event"
            onChange={handleSearch}
            className="px-3 sm:px-4 md:px-6 py-2 md:py-3 border border-[#06354b]/20 bg-[#e6f7ff]/60 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#06354b]/50 w-full max-w-xs sm:max-w-md md:max-w-lg shadow-md rounded-full"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-4 sm:pt-6 pb-8">
          {categories.map((c) => (
            <Button
              key={c.id}
              onClick={() => handleCategoryClick(c.id)}
              className={`px-3 md:px-4 py-1 md:py-2 font-semibold transition-transform text-sm md:text-base rounded-full ${
                currentCategory === c.id
                  ? "bg-[#06354b] text-[#e6f7ff] hover:scale-105"
                  : "bg-[#e6f7ff]/60 text-[#06354b] border border-[#06354b]/40 hover:scale-105"
              }`}
            >
              {c.categoryName || "No Category"}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px]">
          {searchedEvents.length > 0 ? (
            paginate(searchedEvents).map((ev) => {
              const imgUrl = ev.images?.[0]?.path
                ? `http://localhost:8000${ev.images[0].path}`
                : "/aespa.webp";
              const status = getEventStatus(ev);
              return (
                <div
                  key={ev.id}
                  className="rounded-xl border border-[#06354b]/20 bg-[#e6f7ff]/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3 cursor-pointer h-[400px] sm:h-[420px] md:h-[440px]"
                  onClick={() => handleEventClick(ev.id)}
                >
                  <div className="relative w-full h-56 sm:h-60 md:h-64 rounded-xl overflow-hidden border border-[#06354b]/40 bg-[#e6f7ff]/20 shadow-md flex items-center justify-center">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={ev.title || "event"}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "/aespa.webp")}
                      />
                    ) : (
                      <span className="text-gray-800 text-sm">No Image</span>
                    )}
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${status.color}`}
                    >
                      {String(status.text)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm sm:text-base truncate text-[#06354b]">
                        {ev.title}
                      </p>
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#06354b]/10 text-[#06354b] border border-[#06354b]/20">
                        {ev.ticketType || "FREE"}
                      </span>
                    </div>

                    <p className="font-medium text-xs sm:text-sm truncate text-[#06354b]/80 line-clamp-1">
                      deskripsi: {ev.description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      lokasi: {ev.location.locationName}
                    </p>

                    <div className="mt-1 text-xs text-gray-700 leading-relaxed">
                      <div>
                        Start:{" "}
                        {new Date(ev.startTime).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                      <div>
                        End:{" "}
                        {new Date(ev.endTime).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                      <div className="mt-1">
                        Price:{" "}
                        {ev.ticketType === "PAID"
                          ? `Rp${Number(ev.price ?? 0).toLocaleString("id-ID")}`
                          : "FREE"}
                      </div>
                      <div>Total Seats: {Number(ev.totalSeats ?? 0)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-600 text-sm py-10">
              Belum ada data.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage <= 1 || totalPages(searchedEvents) === 0}
            className="h-9 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </Button>

          {Array.from(
            { length: totalPages(searchedEvents) },
            (_, i) => i + 1
          ).map((p) => (
            <Button
              key={p}
              type="button"
              onClick={() => setCurrentPage(p)}
              variant={p === currentPage ? "default" : "outline"}
              className={`h-9 px-3 text-sm transition-all duration-150 ${
                p === currentPage
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
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={
              currentPage >= totalPages(searchedEvents) ||
              totalPages(searchedEvents) === 0
            }
            className="h-9 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withAllRole(CategoryList, ['USER', 'ADMIN']); 