"use client";

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { MdPerson, MdEmail, MdMessage } from "react-icons/md";
import { IdCard } from "lucide-react";
import { FaPhone } from "react-icons/fa";

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY"
      )
      .then(() => {
        setSubmitted(true);
        setLoading(false);
        formRef.current?.reset();
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div
      id="Contact"
      className="min-h-screen flex flex-col items-center justify-start px-3 sm:px-6 md:px-10 lg:px-16 py-20 bg-burning-orange-100 text-burning-orange-950 transition-all duration-300"
    >
      <div className="text-3xl sm:text-4xl md:text-5xl font-medium py-10 sm:py-14 text-center tracking-tight leading-tight">
        Hubungi kami
      </div>

      <form
        ref={formRef}
        onSubmit={sendEmail}
        className="w-full max-w-2xl bg-burning-orange-50 backdrop-blur-sm rounded-2xl shadow-lg border border-burning-orange-500 p-5 sm:p-8 md:p-10 flex flex-col gap-6 border-[#06354b]/20 bg-[#e6f7ff]/40"
      >
        <p className="text-center text-sm sm:text-base md:text-lg font-medium mb-4 text-[#06354b]">
          Jika ada hal penting, silakan beri pesan di sini
        </p>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Nama */}
          <div className="relative flex items-center">
            <MdPerson className="absolute left-4 text-burning-orange-500 text-lg sm:text-xl" />
            <input
              type="text"
              name="user_name"
              placeholder="Nama"
              required
              className="pl-12 w-full border border-burning-orange-500 placeholder-burning-orange-400 rounded-xl py-3 sm:py-4 text-burning-orange-950 text-sm sm:text-base md:text-lg bg-burning-orange-50 focus:outline-none focus:ring-2 focus:ring-burning-orange-400 transition border-[#440806]/40"
            />
          </div>

          {/* User ID */}
          <div className="relative flex items-center">
            <IdCard className="absolute left-4 text-burning-orange-500 text-lg sm:text-xl" />
            <input
              type="text"
              name="user_id"
              placeholder="User Id"
              required
              className="pl-12 w-full border border-burning-orange-500 placeholder-burning-orange-400 rounded-xl py-3 sm:py-4 text-burning-orange-950 text-sm sm:text-base md:text-lg bg-burning-orange-50 focus:outline-none focus:ring-2 focus:ring-burning-orange-400 transition border-[#440806]/40"
            />
          </div>

          {/* Email */}
          <div className="relative flex items-center">
            <MdEmail className="absolute left-4 text-burning-orange-500 text-lg sm:text-xl" />
            <input
              type="email"
              name="user_email"
              placeholder="Email"
              required
              className="pl-12 w-full border border-burning-orange-500 placeholder-burning-orange-400 rounded-xl py-3 sm:py-4 text-burning-orange-950 text-sm sm:text-base md:text-lg bg-burning-orange-50 focus:outline-none focus:ring-2 focus:ring-burning-orange-400 transition border-[#440806]/40"
            />
          </div>

          {/* Telepon */}
          <div className="relative flex items-center">
            <FaPhone className="absolute left-4 text-burning-orange-500 text-lg sm:text-xl" />
            <input
              type="text"
              name="no_telp"
              placeholder="No Telp"
              required
              className="pl-12 w-full border border-burning-orange-500 placeholder-burning-orange-400 rounded-xl py-3 sm:py-4 text-burning-orange-950 text-sm sm:text-base md:text-lg bg-burning-orange-50 focus:outline-none focus:ring-2 focus:ring-burning-orange-400 transition border-[#440806]/40"
            />
          </div>
        </div>

        {/* Pesan */}
        <div className="relative flex items-start">
          <MdMessage className="absolute top-4 left-4 text-burning-orange-500 text-lg sm:text-xl" />
          <textarea
            name="message"
            placeholder="Tulis pesan Anda di sini..."
            required
            rows={5}
            className="pl-12 w-full border border-burning-orange-500 placeholder-burning-orange-400 rounded-xl py-3 sm:py-4 text-burning-orange-950 text-sm sm:text-base md:text-lg bg-burning-orange-50 focus:outline-none focus:ring-2 focus:ring-burning-orange-400 transition resize-none border-[#440806]/40"
          />
        </div>

        {/* Tombol */}
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center gap-2 font-semibold py-3 sm:py-4 rounded-xl text-base sm:text-lg md:text-xl bg-burning-orange-500 hover:bg-burning-orange-600 transition disabled:opacity-60 border border-burning-orange-600 border-[#440806] hover:bg-[#ffc7a8] hover:border-[#7e1810]"
        >
          {loading ? "Mengirim..." : "Kirim Pesan"}
        </button>

        {/* Status */}
        {submitted && (
          <p className="text-green-600 text-center mt-3 font-medium text-sm sm:text-base">
            ✅ Pesan berhasil dikirim!
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
