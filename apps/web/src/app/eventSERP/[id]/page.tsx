"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import withRole from "@/hoc/roleGuard";
import api from "@/helper/apiBe";
import { useUser } from "@/contexts/UserContext";

type EventType = {
  id: number;
  title: string;
  description: string;
  category: { categoryName: string };
  price: number;
  totalSeats: number;
  ticketType: string;
  location: { locationName: string };
  startTime: string;
  endTime: string;
  images: { path: string }[];
};

type Testimonial = {
  id: number;
  userId: string; // gunakan string karena identificationId string
  eventId: number;
  reviewDescription: string;
  rating: number;
};

const EventDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useUser();
  const inputUserId = user?.identificationId || null;

  const [event, setEvent] = useState<EventType | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH EVENT & TESTIMONIAL
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const eventRes = await api.get(`event/events/${id}`);
        setEvent(eventRes.data.data);

        if (eventRes.data.data?.id) {
          const transactionRes = await api.get(
            `transaction/transaction/${eventRes.data.data.id}`,
          );
          setHasPurchased(transactionRes.data.data);

          const testimonialRes = await api.get(
            `testimonial/testimonial/${eventRes.data.data.id}`,
          );
          setTestimonials(testimonialRes.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  // BELI TIKET
  const handlePurchase = async () => {
    try {
      await api.post(`transaction/transaction`, {
        eventId: event?.id,
        qty,
        discountCode,
      });
      alert("Pembelian berhasil!");
      setHasPurchased(true);
    } catch (err) {
      console.error(err);
      alert("Gagal membeli tiket.");
    }
  };

  // TAMBAH TESTIMONIAL
  const handleAddComment = async () => {
    if (!user) return alert("Anda harus login!");
    try {
      await api.post(`testimonial/testimonial/${event?.id}`, {
        reviewDescription: newComment,
        rating: 5,
      });
      setNewComment("");
      refreshTestimonials();
    } catch (err) {
      console.error("Gagal tambah testimonial:", err);
    }
  };

  // MULAI EDIT TESTIMONIAL
  const startEditComment = (t: Testimonial) => {
    setEditCommentId(String(t.id));
    setNewComment(t.reviewDescription);
  };

  // UPDATE TESTIMONIAL
  const handleEditComment = async () => {
    if (!user || !editCommentId) return;
    try {
      await api.put(`testimonial/testimonial/${editCommentId}`, {
        reviewDescription: newComment,
      });
      setNewComment("");
      setEditCommentId(null);
      refreshTestimonials();
    } catch (err) {
      console.error("Gagal update testimonial:", err);
    }
  };

  // HAPUS TESTIMONIAL
  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`testimonial/testimonial/${commentId}`);
      setTestimonials((prev) => prev.filter((t) => Number(t.id) !== commentId));
    } catch (err) {
      console.error("Gagal hapus testimonial:", err);
    }
  };

  // REFRESH TESTIMONIAL
  const refreshTestimonials = async () => {
    if (!event) return;
    const res = await api.get(`testimonial/testimonial/${event.id}`);
    setTestimonials(res.data.data || []);
  };

  if (loading) return <div>Loading event details...</div>;
  if (!event) return <div>Event tidak ditemukan.</div>;

  const now = new Date();
  const end = new Date(event.endTime);
  const isSoldOut = event.totalSeats <= 0 || now > end;
  const imgUrl = event.images?.[0]?.path
    ? `http://localhost:8000${event.images[0].path}`
    : "/aespa.webp"; 

    return (
    <div className="min-h-screen flex justify-center items-center py-10 sm:py-32 md:py-40 flex-col px-4 sm:px-6 md:px-10 md:mt-5 sm:mt-10 mt-10">
      <div className="max-w-5xl w-full bg-[#e6f7ff]/40 rounded-2xl shadow-lg border border-[#06354b]/20 min-h-[700px] sm:min-h-[750px] md:h-[800px] p-6 sm:p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gambar */}
          <div className="w-full h-56 sm:h-64 md:h-80 flex items-center justify-center border rounded-xl overflow-hidden border-[#06354b]/60">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={event.title}
                width={600}
                height={400}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>

          {/* Detail Event */}
          <div className="space-y-3 text-[#06354b]">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed">
              Deskripsi: {event.description}
            </p>

            <div className="text-xs sm:text-sm leading-relaxed mt-2 space-y-1">
              <p>Kategori: 📂 {event.category?.categoryName}</p>
              <p>Tiket: 🎟 {event.ticketType}</p>
              <p>Lokasi: 📍 {event.location?.locationName}</p>
              <p>
                💰{" "}
                {event.price > 0
                  ? `Rp${event.price.toLocaleString("id-ID")}`
                  : "FREE"}
              </p>
            </div>

            {!hasPurchased ? (
              <div className="pt-4 space-y-3 justify-center flex items-start flex-col">
                <div className="justify-center flex flex-col items-center sm:items-start">
                  <span className="text-sm font-medium">Jumlah Tiket</span>
                  <input
                    placeholder="Jumlah Tiket"
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="border p-2 rounded w-20 text-sm border-[#06354b]/60 mt-1"
                  />
                </div>
                <Button
                  onClick={handlePurchase}
                  className="bg-[#06354b] text-[#e6f7ff] w-full sm:w-auto"
                >
                  Beli Tiket
                </Button>
              </div>
            ) : (
              <p className="text-green-600 font-semibold pt-4 text-sm sm:text-base">
                ✅ Anda sudah membeli tiket event ini.
              </p>
            )}
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold my-8 sm:my-10 text-[#06354b]">
          Komentar & Testimonial
        </h2>

        {/* Komentar */}
        {hasPurchased && (
          <div className="mt-8 sm:mt-10 border-t pt-6">
            <div className="max-h-60 overflow-y-auto space-y-2 sm:space-y-3">
              {testimonials.length > 0 ? (
                testimonials.map((t: any) => (
                  <div
                    key={t.id}
                    className="border bg-[#e6f7ff]/40 rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                  >
                    <p className="text-gray-800 text-sm sm:text-base">
                      {t.reviewDescription}
                    </p>
                    {String(t.userId) === String(inputUserId) && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditComment(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteComment(t.id)}
                          className="text-red-600"
                        >
                          Hapus
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">Belum ada komentar.</p>
              )}
            </div>

            {/* Input komentar */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <input
                type="text"
                placeholder="Tulis komentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border p-2 rounded text-sm sm:text-base"
              />
              {editCommentId ? (
                <Button
                  onClick={handleEditComment}
                  className="bg-blue-500 text-white"
                >
                  Update
                </Button>
              ) : (
                <Button
                  onClick={handleAddComment}
                  className="bg-[#06354b] text-white"
                >
                  Kirim
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRole(EventDetailPage, 'USER');