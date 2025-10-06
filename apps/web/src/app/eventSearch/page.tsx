"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash.debounce';
import withRole from '@/hoc/roleGuard';

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
};

type Category = {
  id: number;
  categoryName: string;
  event: Event[];
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventsPerPage] = useState<number>(4);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/category/categories',
        );
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed fetch categories');
        setLoading(false);
      }
    };
    // be function get in get out create effect data 
    fetchCategories();
  }, []);

  useEffect(() => {
    const initialSearchTerm = searchParams.get('searchTerm') || '';
    setSearchTerm(initialSearchTerm);
  }, [searchParams]);
  // Menyiratkan bahwa efek akan dijalankan kembali setiap kali searchParams berubah.

  const handleCategoryClick = (categoryId: number) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/eventSearch/${eventId}`);
  };

  // 1. Buat debounced handle
  const connectedHandle = useMemo(() => {
    return debounce((query: string) => {
      setSearchTerm(query);

      const queryParams = new URLSearchParams();
      if (query) queryParams.set("searchTerm", query);

      router.push(`/eventSearch?${queryParams.toString()}`);
    }, 300); // delay 300ms, bisa diubah
  }, [router]);

  // 2. Callback yang memanggil connectedHandle
  const handleSearch = useCallback(
    (query: string) => {
      connectedHandle(query);
    },
    [connectedHandle]
  );

  const paginate = (events: Event[]) => {
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return events.slice(indexOfFirstEvent, indexOfLastEvent);
  };

  const totalPages = (events: Event[]) =>
    Math.ceil(events.length / eventsPerPage);
  const allEvents = categories.flatMap((category) => category.event);

  const filteredEvents =
    currentCategory !== null
      ? categories.find((category) => category.id === currentCategory)?.event ||
        []
      : allEvents;

  const searchedEvents = filteredEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <div> Loading ... </div>;
  if (error) return <div> {error} </div>;

  return (
    <div className="bg-gray-100 flex-1 relative h-[2400px]">
      <div className="relative h-[2400px]">
        <Image
          src="/105408.gif"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 w-full h-full z-0"
        />
        <div className="relative z-10 flex flex-col items-center py-16 bg-gray-100 bg-opacity-80 h-[2400px]">
          <div className="p-6 lg:p-10 xl:px-28 px-12">
            <p className="text-4xl font-bold font-KalesiRoundedDemo justify-center text-gray-600 flex">
              ~ Event research ~
            </p>
            <div className="flex flex-col items-center space-y-4 pt-10">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => connectedHandle(e.target.value)}
                placeholder="Search for an event"
                className="px-10 w-96 py-2 rounded-lg border border-gray-100 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-60 text-gray-950 placeholder-gray-600 text-1xl shadow-md"
              />
            </div>

            <div className="mb-6 flex flex-wrap justify-center space-x-4 mt-10">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`px-4 py-2 rounded-none font-semibold transition-transform transform ${
                      currentCategory === category.id
                        ? 'bg-blue-600 text-gray-100 hover:bg-blue-500 hover:scale-105'
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:scale-105'
                    } shadow-md`}
                  >
                    {category.categoryName}
                  </Button>
                ))
              ) : (
                <div> No categories available </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="border p-4 rounded-lg shadow-lg backdrop-blur-lg bg-white/80">
                <div className="space-y-4 w-[900px] mt-4">
                  {searchedEvents.length > 0 ? (
                    paginate(searchedEvents).map((event) => (
                      <div
                        key={event.id}
                        className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleEventClick(event.id)}
                      >
                        <h3 className="text-xl font-semibold mb-2">
                          {event.title}
                        </h3>
                        {event.images.length > 0 && (
                          <Image
                            src={event.images[0].path}
                            alt={event.title}
                            width={400}
                            height={250}
                            className="rounded-md"
                          />
                        )}
                        <p className="text-gray-700 mt-2">
                          {event.description}
                        </p>
                        <p className="text-gray-600">
                          Location: {event.location.locationName}
                        </p>
                        <p className="text-gray-800">
                          Ticket status: {event.ticketType}
                        </p>
                        <p className="text-gray-800">
                          Seats Available: {event.totalSeats}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="justify-center flex pb-4">
                      No events available
                    </p>
                  )}
                </div>
                {searchedEvents.length > eventsPerPage && (
                  <div className="flex justify-between mt-4">
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages(searchedEvents)}
                    </span>
                    <Button
                      disabled={currentPage === totalPages(searchedEvents)}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRole(CategoryList, 'USER');
