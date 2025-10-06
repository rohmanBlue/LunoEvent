"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import withRole from '@/hoc/roleGuard';
import { useRouter } from 'next/navigation';

type Event = {
  user: number;
  ticketType: string;
  location?: { id: number; locationName: string };
  id: number;
  title: string;
  description: string;
  totalSeats: number;
  images: { id: number; path: string; eventId: number }[];
  price: number;
  startTime: string;
  endTime: string;
};

type Testimonial = {
  id: number;
  userId: number;
  eventId: number;
  reviewDescription: string;
  rating: number;
};

type Props = {
  params: { id: string };
};

const EventDetailPage: React.FC<Props> = ({ params }: Props) => {
  const { id } = params;
  const [event, setEvent] = useState<Event | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviewDescription, setReviewDescription] = useState('');
  const [rating, setRating] = useState(1);
  const [message, setMessage] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [inputUserId, setInputUserId] = useState<number>(1); // Set the user ID here
  const [qty, setQty] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchaseStatus, setPurchaseStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const eventResponse = await axios.get(
          `http://localhost:8000/api/event/events/${id}`,
        );

        const eventData = eventResponse.data.data;
        setEvent(eventData);

        const ticketResponse = await axios.get(
          `http://localhost:8000/api/transaction/transaction/${inputUserId}`,
        );

        const hasPurchased = ticketResponse.data.exists;
        setHasPurchased(hasPurchased);

        const testimonialResponse = await axios.get(
          `http://localhost:8000/api/testimonial/testimonial/${id}`,
        );
        setTestimonials(testimonialResponse.data);
      } catch (error) {
        console.error('Error fetching event details or purchase status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, inputUserId]);

  const handlePurchase = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/transaction/transaction',
        {
          userId: inputUserId,
          eventId: event?.id,
          qty,
          discountCode,
        },
      );
      localStorage.setItem(`purchaseStatus_${id}_${inputUserId}`, 'true');
      setMessage(response.data.message || 'Purchase successful!');
      setPurchaseStatus(true);
      setHasPurchased(true); // Update hasPurchased state
    } catch (error: any) {
      const errorMessage = 'Error processing purchase or insufficient balance';
      setMessage(errorMessage);
      console.error('Error purchasing event:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!event || new Date().getTime() <= new Date(event.endTime).getTime()) {
      setMessage('You cannot submit a testimonial for this event.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/testimonial/testimonial',
        {
          userId: inputUserId,
          eventId: event.id,
          reviewDescription,
          rating,
        },
      );
      setTestimonials([...testimonials, response.data]);
      setReviewDescription('');
      setRating(1);
      setMessage('Testimonial submitted successfully!');
    } catch (error) {
      setMessage('Error submitting testimonial.');
      console.error('Error submitting testimonial:', error);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await axios.delete(
          `http://localhost:8000/api/testimonial/${testimonialId}`,
        );
        setTestimonials(testimonials.filter((t) => t.id !== testimonialId));
        setMessage('Testimonial deleted successfully!');
      } catch (error) {
        setMessage('Error deleting testimonial.');
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  const currentTime = new Date().getTime();
  const startTime = new Date(event.startTime).getTime();
  const endTime = new Date(event.endTime).getTime();
  const isOngoing = currentTime > startTime && currentTime < endTime;
  const isEnded = currentTime > endTime;

  return (
    <div className="bg-gray-100 p-6 px-28 py-8">
      <h1 className="text-4xl font-bold">{event.title}</h1>
      {event.images && event.images.length > 0 && (
        <Image
          src={event.images[0].path}
          alt={event.title}
          width={600}
          height={400}
          className="my-4 rounded-md"
        />
      )}
      <p className="text-lg mt-4"> {event.description} </p>
      <p className="text-lg mt-4"> {event.startTime} </p>
      <p className="text-lg mt-4"> {event.endTime} </p>
      <p className="text-gray-600 mt-2">
        Location:{' '}
        {event.location ? event.location.locationName : 'Location not available'}
      </p>
      <p className="text-gray-800 mt-2">Seats Available: {event.totalSeats}</p>
      <p className="text-gray-800 mt-2">Price: {event.price}</p>
      <p
        className={`text-${
          isEnded ? 'red' : isOngoing ? 'green' : 'gray'
        }-600 font-bold mt-2`}
      >
        Status: {isEnded ? 'Ended' : isOngoing ? 'Ongoing' : 'Upcoming'}
      </p>
      <p className="text-gray-800 mt-2">Ticket Type: {event.ticketType}</p>

      {/* Purchase Form */}
      {!isEnded && !hasPurchased && (
        <div className="bg-yellow-100 p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-4">Purchase Tickets</h2>
          <label className="block mb-2">
            User ID:
            <input
              type="number"
              value={inputUserId}
              onChange={(e) => setInputUserId(parseInt(e.target.value))}
              min="1"
              className="block w-full mt-1 border rounded p-2"
            />
          </label>
          <label className="block mb-2">
            Quantity:
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
              min="1"
              className="block w-full mt-1 border rounded p-2"
            />
          </label>
          <label className="block mb-4">
            Discount Code:
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="block w-full mt-1 border rounded p-2"
            />
          </label>
          <button
            onClick={handlePurchase}
            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Buy Now
          </button>
          {message && <p className="mt-4 text-lg font-semibold">{message}</p>}
        </div>
      )}

      {/* Testimonial Section */}
      {hasPurchased && isEnded && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Leave a Testimonial</h2>
          <textarea
            value={reviewDescription}
            onChange={(e) => setReviewDescription(e.target.value)}
            placeholder="Write your review here..."
            className="w-full border rounded p-2 mb-2"
          />
          <label className="block mb-2">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="block mb-4 border rounded p-2"
          >
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
          {message && <p className="mt-4 text-lg font-semibold">{message}</p>}
        </div>
      )}

      {/* Display Testimonials */}
      {testimonials.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border p-4 mb-4 rounded-lg shadow-sm"
            >
              <p className="text-lg">{testimonial.reviewDescription}</p>
              <p className="text-yellow-500 font-bold">
                Rating: {testimonial.rating}/5
              </p>
              <button
                onClick={() => handleDeleteTestimonial(testimonial.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-2"
              >
                Delete Testimonial
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default withRole(EventDetailPage, 'USER');
