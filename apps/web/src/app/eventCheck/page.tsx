"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

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

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/event/events`,
          {
            params: {
              page,
              limit: 10,
            },
          },
        );

        setEvents(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error('error show event', error);
      }
    };

    fetchEvents();
  }, [page]);


  // never can be functional edit delete because back end never edit and front end 
  const handleEdit = (eventId: number) => {
    console.log(`Edit event with id ${eventId}`);
  };

  const handleDelete = async (eventId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/event/events/${eventId}`);
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('error deleting event ', error);
    }
  };

  return (
    <div className="p-4 px-28 py-20">
      <h1 className="text-2xl font-bold mb-4">Event List </h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => console.log('Add new event')}
      >
        <Link href="/dashboard/admin/create">Add New Event </Link>
      </button>
      <ul className="space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out relative"
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                onClick={() => handleEdit(event.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(event.id)}
              >
                Delete
              </button>
            </div>

            {event.images.length > 0 && (
              <Image
                src={event.images[0].path}
                alt={event.title}
                className="my-4 rounded-md w-full h-48 object-cover"
              />
            )}
            <p className="text-gray-700 mt-2">{event.description}</p>
            <p className="text-gray-600 mt-2">
              Location: {event.location.locationName}
            </p>
            <p className="text-gray-600 mt-2">
              Seats Available: {event.totalSeats}
            </p>
            <p className="text-gray-600 mt-2">Price: {event.price}</p>
            <p className="text-gray-600 mt-2">
              Ticket Type: {event.ticketType}
            </p>
            {/* tambhkan jika butuh */}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between items-center">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EventList;
