"use client"
import React, { useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button'; // Adjust path as necessary
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Event = {
  ticketType: ReactNode;
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
  event: Event [ ] ;
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventsPerPage] = useState<number>(4);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/category/categories',
        );
        setCategories(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);
  };

  const handleEventClick = (eventId: number) => {
    router.push(`eventSearch/${eventId}`);
  };

  if (loading) return <div>Loading ... </div>;
  if (error) return <div>{error}</div>;

  const paginate = (events: Event[]) => {
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return events.slice(indexOfFirstEvent, indexOfFirstEvent + eventsPerPage);
  };

  const totalPages = (events: Event[]) =>
    Math.ceil(events.length / eventsPerPage);

  const allEvents = categories.flatMap((category) => category.event);

  const filteredEvents =
    currentCategory !== null
      ? categories.find((category) => category.id === currentCategory)?.event ||
        []
      : allEvents;

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
        <div className="relative z-10 flex flex-col items-center py-20 bg-gray-100 bg-opacity-80 h-[2400px]">
          <div className="flex flex-col items-center p-14 py-2 px-3 rounded-xl">
            <h1 className="text-gray-800 text-2xl md:text-6xl font-bold text-center font-KalesiRoundedDemo">
              Event u love 🛩️
            </h1>
          </div>

          <div className="p-6 lg:p-10 xl:px-28 px-12">
            <div className="mb-6 flex flex-wrap justify-center space-x-4">
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
                  {filteredEvents.length > 0 ? (
                    paginate(filteredEvents).map((event) => {
                      // Determine event status
                      const currentTime = new Date().getTime();
                      const startTime = new Date(event.startTime).getTime();
                      const endTime = new Date(event.endTime).getTime();
                      const isOngoing =
                        currentTime > startTime && currentTime < endTime;
                      const isEnded = currentTime > endTime;

                      return (
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
                              src={`${event.images[0].path}`}
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
                          <p
                            className={`text-${isEnded ? 'red' : isOngoing ? 'green' : 'gray'}-600 font-bold mt-2`}
                          >
                            Status:{' '}
                            {isEnded
                              ? 'Ended'
                              : isOngoing
                                ? 'Ongoing'
                                : 'Upcoming'}
                          </p>
                          <p className="text-gray-800">
                            Ticket status: {event.ticketType}
                          </p>
                          <p className="text-gray-800">
                            Seats Available: {event.totalSeats}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="justify-center flex pb-4">
                      No events available
                    </p>
                  )}
                </div>
                {filteredEvents.length > eventsPerPage && (
                  <div className="flex justify-between mt-4">
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages(filteredEvents)}
                    </span>
                    <Button
                      disabled={currentPage === totalPages(filteredEvents)}
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

export default CategoryList;
