"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import api from "@/helper/apiBe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import withRole from "@/hoc/roleGuard";
import { CATEGORY_OPTIONS } from "./type";
import { MdEvent } from "react-icons/md";
type TicketType = "FREE" | "PAID";


const initialFormData = {
  id: "",
  title: "",
  description: "",
  category: "",
  price: 0,
  totalSeats: 0,
  location: "",
  ticketType: "FREE" as TicketType,
  startTime: "",
  endTime: "",
  file: null as File | null,
};

type FormDataKey = keyof typeof initialFormData;

const toLocalInputValue = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const toIsoString = (localValue?: string) => {
  if (!localValue) return "";
  return new Date(localValue).toISOString();
};

const MyForm: React.FC = ({ editData }: any) => {
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState<string | null>(null);
  const [dataList, setDataList] = useState<any[]>([]);

  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/event/user-event/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const events = Array.isArray(res?.data?.data) ? res.data.data : [];
        setDataList(events);
        setPage(1);
      } catch (err) {
        console.error("GET Error:", err);
      }
    };
    fetchData();
  }, [token]);
  const fetchData = async () => {
    try {
      const res = await api.get("/event/user-event/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const events = Array.isArray(res?.data?.data) ? res.data.data : [];
      setDataList(events);
    } catch (err) {
      console.error("GET Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  });

  useEffect(() => {
    if (editData) {
      setFormData((s) => ({
        ...s,
        id: editData.id || "",
        title: editData.title || "",
        description: editData.description || "",
        // gunakan id/value jika ada, fallback ke nama
        category:
          editData.category?.id ??
          editData.category?.value ??
          editData.category?.categoryName ??
          "",
        price: Number(editData.price ?? 0),
        totalSeats: Number(editData.totalSeats ?? 0),
        location: editData.location?.locationName || "",
        ticketType: (editData.ticketType as TicketType) || "FREE",
        startTime: toLocalInputValue(editData.startTime),
        endTime: toLocalInputValue(editData.endTime),
        file: null,
      }));
      const firstPath = editData?.images?.[0]?.path as string | undefined;
      setPreview(firstPath ?? null);
    }
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const name = e.target.name as FormDataKey;

    if (name === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      if (file && file.size > 50 * 1024 * 1024) {
        alert("File terlalu besar, maksimal 50MB!");
        return;
      }
      setFormData((s) => ({ ...s, file }));
      if (file && file.type.startsWith("image/")) {
        if (preview) URL.revokeObjectURL(preview);
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
      return;
    }

    if (name === "price" || name === "totalSeats") {
      const v = (e as any).target.value;
      const num = v === "" ? 0 : Number(v);
      setFormData((s) => ({ ...s, [name]: Number.isNaN(num) ? 0 : num }));
      return;
    }

    setFormData((s) => ({ ...s, [name]: (e as any).target.value }));
  };

  const handleDelete = async (id?: string) => {
    const targetId = id || formData.id;
    if (!targetId) return console.log("Tidak ada data");
    try {
      const bearer = token || localStorage.getItem("token") || "";
      await api.delete(`/event/delete-event/${targetId}`, {
        headers: { Authorization: `Bearer ${bearer}` },
      });
      alert("Event berhasil dihapus!");
      if (!id) setFormData(initialFormData); // reset hanya jika delete dari form
      setPreview(null);
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const setTicketType = (v: TicketType) =>
    setFormData((s) => ({
      ...s,
      ticketType: v,
      price: v === "FREE" ? 0 : s.price,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startISO = toIsoString(formData.startTime);
    const endISO = toIsoString(formData.endTime);

    const data = new FormData();
    if (Array.isArray(formData.file)) {
      formData.file.forEach((file) => {
        data.append("eve", file); // <--- ini HARUS 'eve' sesuai backend
      });
    } else if (formData.file) {
      data.append("eve", formData.file);
    }
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", String(formData.price ?? 0));
    data.append("totalSeats", String(formData.totalSeats ?? 0));
    data.append("location", formData.location);
    data.append("ticketType", formData.ticketType);
    data.append("startTime", startISO);
    data.append("endTime", endISO);

    try {
      if (!formData.id) {
        const res = await api.post("/event/event", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Event berhasil dibuat");
        if (res?.data?.id) setFormData((s) => ({ ...s, id: res.data.id }));
      } else {
        await api.patch(`/event/update-event/${formData.id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Event berhasil diupdate");
        console.log("PATCH ID:", formData.id);
      }
      fetchData();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  const handleEdit = (item: any) => {
    setFormData((s) => ({
      ...s,
      id: item.id || "",
      title: item.title || "",
      description: item.description || "",
      category:
        item.category?.id ??
        item.category?.value ??
        item.category?.categoryName ??
        "",
      price: Number(item.price ?? 0),
      totalSeats: Number(item.totalSeats ?? 0),
      location: item.location?.locationName || "",
      ticketType: (item.ticketType as TicketType) || "FREE",
      startTime: toLocalInputValue(item.startTime),
      endTime: toLocalInputValue(item.endTime),
      file: null,
    }));
    const firstPath = item?.images?.[0]?.path as string | undefined;
      window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Ambil kategori unik dari data
  const categoryNames = useMemo(() => {
    const unique = new Set<string>();
    dataList.forEach((ev) =>
      unique.add(ev?.category?.categoryName || "Uncategorized"),
    );
    return Array.from(unique).sort();
  }, [dataList]);

  // Filter berdasarkan kategori aktif
  const filteredEvents = useMemo(() => {
    if (!currentCategory) return dataList;
    return dataList.filter(
      (ev) =>
        (ev?.category?.categoryName || "Uncategorized") === currentCategory,
    );
  }, [dataList, currentCategory]);

  // Hitung total halaman
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / perPage));

  // Jaga agar page tetap valid saat totalPages berubah
  useEffect(() => {
    setPage((p) => (p > totalPages ? totalPages : p));
  }, [totalPages]);

  // reset ke page 1 hanya kalau kategori berubah
  useEffect(() => {
    setPage(1);
  }, [currentCategory]);

  // Ambil event yang ditampilkan per halaman
  const displayed = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredEvents.slice(start, start + perPage);
  }, [filteredEvents, page, perPage]);

  // Navigasi halaman
  const goTo = (p: number) => {
    if (totalPages === 0) return;
    setPage(Math.min(Math.max(p, 1), totalPages));
  };
  const getEventStatus = (displayed: any) => {
    const now = new Date();
    const start = new Date(displayed.startTime);
    const end = new Date(displayed.endTime);
    const diffDays = Math.ceil(
      (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (displayed.totalSeats <= 0) {
      return {
        color: "bg-red-500 text-white",
        text: "Tiket habis",
      };
    } else if (now > end) {
      return {
        color: "bg-red-500 text-white",
        text: "Waktu habis",
      };
    } else if (displayed.totalSeats < 5) {
      return {
        color: "bg-pink-300 text-pink-800",
        text: "Tiket mau habis",
      };
    } else if (diffDays <= 3) {
      return {
        color: "bg-pink-300 text-pink-800",
        text: "Waktu mau habis",
      };
    } else if (diffDays <= 2 && displayed.ticketType === "PAID") {
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
  const prev = () => goTo(page - 1);
  const next = () => goTo(page + 1);

 return (
    <section className="w-full min-h-screen py-40 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center flex-col justify-center text-[#06354b]/80 font-medium">
      {/* Header */}
      <div className="w-full flex text-center text-3xl justify-center pb-16 font-medium text-[#06354b]">
        <MdEvent className="mr-3 text-4xl sm:text-4xl text-[#06354b]" />
        <span className="text-3xl sm:text-4xl text-[#06354b]">Management Event</span>
      </div>

      {/* Container */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl rounded-xl sm:rounded-2xl shadow-lg border border-[#06354b]/20 bg-[#e6f7ff]/40 backdrop-blur-xl p-3 sm:p-4 md:p-6 lg:p-8">
        <h2 className="text-xl sm:text-xl md:text-2xl mb-4 sm:mb-6 text-center tracking-wide font-medium text-[#06354b] mt-6">
          {formData.id ? "Edit Event" : "Create Event"}
        </h2>

        {/* Upload Image */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-sm sm:text-base text-[#06354b]/80">Image</label>
          <Input
            name="file"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-xs sm:text-sm bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur-xl"
          />
          {preview && (
            <div className="relative aspect-square w-24 sm:w-28 md:w-32">
              <Image
                src={preview}
                alt="preview"
                fill
                sizes="(max-width: 640px) 6rem, (max-width: 768px) 7rem, 8rem"
                className="rounded-lg sm:rounded-xl object-cover border-2 border-[#06354b]/80 shadow"
              />
              <button
                type="button"
                onClick={() => {
                  if (preview) URL.revokeObjectURL(preview);
                  setPreview(null);
                }}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-0.5 sm:p-1 bg-red-500/90 rounded-full h-5 w-5 sm:h-6 sm:w-6 text-white text-xs sm:text-sm flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4 md:space-y-6"
        >
          <div>
            <label className="text-sm sm:text-base">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Tech Innovation Summit 2025"
              className="mt-1 sm:mt-2 w-full text-sm sm:text-base bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur"
              required
            />
          </div>

          <div>
            <label className="text-sm sm:text-base">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Konferensi tahunan membahas inovasi teknologi terbaru di Asia Tenggara."
              className="mt-1 sm:mt-2 w-full text-sm sm:text-base bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur min-h-[200px]"
              required
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="text-sm sm:text-base">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 sm:mt-2 w-full text-sm sm:text-base bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur h-10 px-3"
                required
              >
                <option value="" disabled>
                  Pilih kategori
                </option>
                {CATEGORY_OPTIONS.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm sm:text-base">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Jakarta Convention Center, Jakarta"
                className="mt-1 sm:mt-2 w-full text-sm sm:text-base bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur"
                required
              />
            </div>
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="text-sm sm:text-base">Start time</label>
              <Input
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                className="mt-1 sm:mt-2 w-full text-xs sm:text-sm bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur"
                required
              />
            </div>
            <div>
              <label className="text-sm sm:text-base">End time</label>
              <Input
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
                className="mt-1 sm:mt-2 w-full text-xs sm:text-sm bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur"
                required
              />
            </div>
          </div>

          {/* Ticket Type */}
          <div>
            <label className="text-sm sm:text-base">Ticket Type</label>
            <div className="mt-1 sm:mt-2 flex flex-col xs:flex-row gap-2 sm:gap-3">
              <Button
                type="button"
                variant={formData.ticketType === "FREE" ? "default" : "outline"}
                onClick={() => setTicketType("FREE")}
                className={`flex-1 text-sm sm:text-base ${
                  formData.ticketType === "FREE"
                    ? "backdrop-blur border border-[#06354b]/80 bg-[#e6f7ff]/40"
                    : ""
                }`}
              >
                FREE
              </Button>
              <Button
                type="button"
                variant={formData.ticketType === "PAID" ? "default" : "outline"}
                onClick={() => setTicketType("PAID")}
                className={`flex-1 text-sm sm:text-base ${
                  formData.ticketType === "PAID"
                    ? "backdrop-blur border border-[#06354b]/80 bg-[#e6f7ff]/40"
                    : ""
                }`}
              >
                PAID
              </Button>
            </div>
          </div>

          {/* Price & Seats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="text-sm sm:text-base">
                Price {formData.ticketType === "FREE" ? "(FREE => 0)" : ""}
              </label>
              <Input
                name="price"
                type="number"
                min={0}
                step="1000"
                value={formData.price}
                onChange={handleChange}
                disabled={formData.ticketType === "FREE"}
                className="mt-1 sm:mt-2 w-full text-sm sm:text-base bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur"
                required={formData.ticketType !== "FREE"}
              />
            </div>
            <div>
              <label className="text-sm sm:text-base text-[#06354b]/80">
                Total Seats
              </label>
              <Input
                name="totalSeats"
                type="number"
                min={0}
                step="1"
                value={formData.totalSeats}
                onChange={handleChange}
                className="mt-1 sm:mt-2 w-full text-sm sm:text-base bg-[#e6f7ff]/40 border border-[#06354b]/80 rounded-lg sm:rounded-xl backdrop-blur"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData(initialFormData);
                setPreview(null);
              }}
              className="w-full sm:w-auto text-sm sm:text-base backdrop-blur border border-[#06354b]/80 bg-[#e6f7ff]/40"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto text-sm sm:text-base backdrop-blur border border-[#06354b]/80 bg-[#79dfff] text-[#06354b] shadow-md font-bold hover:bg-blue-800/70 transition-colors"
            >
              {formData.id ? "Update" : "Create"}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center w-full my-16 text-[#06354b]/60">
          <div className="flex-1 h-px bg-[#06354b]/60" />
          <span className="px-2 text-xs sm:text-sm">List Data</span>
          <div className="flex-1 h-px bg-[#06354b]/60" />
        </div>

        {/* Filter */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-sm font-medium text-[#06354b]/80">
              Filter kategori:
            </label>
            <select
              value={currentCategory ?? ""}
              onChange={(e) =>
                setCurrentCategory(
                  e.target.value === "" ? null : e.target.value
                )
              }
              className="h-9 text-sm bg-[#e6f7ff]/60 border border-[#06354b]/80 rounded-lg px-3 backdrop-blur"
            >
              <option>Semua</option>
              {categoryNames.map((name: any) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List Data */}
        <div className="mt-6 sm:mt-8">
          <div className="mt-8">
            <h3 className="text-lg text-[#06354b] mb-4">Data Terbaru</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 w-full">
              {displayed.length > 0 ? (
                displayed.map((item: any) => {
                  const img = item?.images?.[0]?.path
                    ? `http://localhost:8000${item.images[0].path}`
                    : "/aespa.webp";
                  const status = getEventStatus(item);
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#06354b]/40 bg-[#e6f7ff]/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3"
                    >
                      <div className="relative w-full h-60 rounded-xl overflow-hidden border border-[#06354b]/40 bg-[#e6f7ff]/20 shadow-md">
                        {img ? (
                          <Image
                            src={img}
                            alt={item.title || "event"}
                            width={600}
                            height={600}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.currentTarget.src = "/placeholder.png")
                            }
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#06354b]/60 text-sm">
                            No Image
                          </div>
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
                            {item.title || "-"}
                          </p>
                          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#06354b]/10 text-[#06354b] border border-[#06354b]/20">
                            {item.ticketType || "FREE"}
                          </span>
                        </div>
                        <p className="font-medium text-xs sm:text-sm truncate text-[#06354b]/80 line-clamp-1">
                          deskripsi: {item.description}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          lokasi: {item.location.locationName}
                        </p>

                        <div className="mt-1 text-xs text-gray-700 leading-relaxed">
                          <div>Start: {toLocalInputValue(item.startTime)}</div>
                          <div>End: {toLocalInputValue(item.endTime)}</div>
                          <div className="mt-1">
                            Price:{" "}
                            {item.ticketType === "PAID"
                              ? `Rp${Number(
                                  item.price ?? 0
                                ).toLocaleString("id-ID")}`
                              : "FREE"}
                          </div>
                          <div>Total Seats: {Number(item.totalSeats ?? 0)}</div>
                        </div>
                      </div>

                      <div className="mt-2 flex gap-2 flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                          className="h-8 px-3 text-xs border border-[#06354b]/20 bg-[#06354b]/10 text-[#06354b] hover:bg-[#06354b]/20 transition"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 px-3 text-xs border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </Button>
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
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={prev}
            disabled={page <= 1 || totalPages === 0}
            className="h-9 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </Button>

          <div className="flex flex-wrap items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                type="button"
                onClick={() => goTo(p)}
                variant={p === page ? "default" : "outline"}
                className={`h-9 px-3 text-sm ${
                  p === page
                    ? "bg-[#06354b] text-white hover:bg-[#074665]"
                    : "hover:bg-[#06354b]/10"
                }`}
              >
                {p}
              </Button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={next}
            disabled={page >= totalPages || totalPages === 0}
            className="h-9 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

export default withRole(MyForm, 'ADMIN');