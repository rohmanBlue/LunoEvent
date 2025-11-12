'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieUI() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah pilih
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
    // Aktifkan analytics atau tracking di sini
    console.log('Cookies accepted');
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
    console.log('Cookies declined');
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ease-out ${
        isAnimating ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 p-6 shadow-2xl backdrop-blur-sm">
          {/* Decorative Elements */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-4 -left-8 h-24 w-24 rounded-full bg-white/20 blur-xl" />
          
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-lg">
                <Cookie className="h-6 w-6 text-amber-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-bold text-gray-900">
                  We use cookies 🍪
                </h3>
                <p className="text-sm leading-relaxed text-gray-800">
                  {/* We use cookies to improve your browsing experience. By clicking "Accept all", you agree to the use of cookies. */}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-shrink-0">
              <button
                onClick={handleDecline}
                className="rounded-xl bg-white/50 px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:bg-white/70 active:scale-95"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-95"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
