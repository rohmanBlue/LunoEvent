import { Request, Response } from "express";
import prisma from "../prisma";

export class TestimonialController {
  // === CREATE TESTIMONIAL ===
  async createTestimonial(req: Request, res: Response) {
    const userId = res.locals.decrypt?.id; // dari token
    const { eventId } = req.params;
    const { reviewDescription, rating } = req.body;

   
    try {
      const event = await prisma.event.findUnique({
        where: { id: Number(eventId) },
      });

      if (!event) {
        return res.status(404).send({ message: "Event not found." });
      }

      const now = new Date().getTime();
      const endTime = new Date(event.endTime).getTime();

      // Event harus selesai dulu
      if (now > endTime) {
        return res
          .status(400)
          .send({ message: "Event belum selesai, komentar belum bisa dibuat." });
      }

  // Cek apakah user sudah beli event ini
      const purchasedTicket = await prisma.ticket.findFirst({
        where: { userId, eventId: Number(eventId), status: "PAID" },
      });

      if (!purchasedTicket) {
        return res
          .status(403)
          .send({ message: "Kamu belum membeli event ini." });
      }

      // Buat testimonial
      const newTestimonial = await prisma.testimonial.create({
        data: { userId, eventId: Number(eventId), reviewDescription, rating },
      });

      res.status(201).send({
        message: "Testimonial berhasil dibuat.",
        data: newTestimonial,
      });
    } catch (error) {
      res.status(500).send({ message: "Gagal membuat testimonial.", error });
    }
  }

 // === READ TESTIMONIAL BY EVENT ===
async readTestimonial(req: Request, res: Response) {
  const { eventId } = req.params;

  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { eventId: Number(eventId) },
      include: {
        user: {
          select: { id: true,  email: true, testimonial: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Kembalikan array kosong daripada error
    res.status(200).json({
      success: true,
      data: testimonials,
      message:
        testimonials.length === 0
          ? "Belum ada testimonial untuk event ini."
          : "Berhasil mengambil testimonial.",
    });
  } catch (error) {
    console.error("Error ambil testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil testimonial.",
    });
  }
}


  // === UPDATE TESTIMONIAL ===
  async updateTestimonial(req: Request, res: Response) {
    const userId = res.locals.decrypt?.id;
    const { id } = req.params;
    const { reviewDescription, rating } = req.body;

    try {
      const testimonial = await prisma.testimonial.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!testimonial) {
        return res.status(404).send({ message: "Testimonial tidak ditemukan." });
      }

      if (testimonial.userId !== userId) {
        return res
          .status(403)
          .send({ message: "Tidak boleh mengubah testimonial orang lain." });
      }

      const updated = await prisma.testimonial.update({
        where: { id: parseInt(id, 10) },
        data: { reviewDescription, rating },
      });

      res.status(200).send({
        message: "Testimonial berhasil diupdate.",
        data: updated,
      });
    } catch (error) {
      res.status(500).send({ message: "Gagal mengupdate testimonial.", error });
    }
  }

  // === DELETE TESTIMONIAL ===
  async deleteTestimonial(req: Request, res: Response) {
    const userId = res.locals.decrypt?.id;
    const { id } = req.params;

    try {
      const testimonial = await prisma.testimonial.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!testimonial) {
        return res.status(404).send({ message: "Testimonial tidak ditemukan." });
      }

      if (testimonial.userId !== userId) {
        return res
          .status(403)
          .send({ message: "Tidak boleh menghapus testimonial orang lain." });
      }

      await prisma.testimonial.delete({
        where: { id: parseInt(id, 10) },
      });

      res.status(200).send({ message: "Testimonial berhasil dihapus." });
    } catch (error) {
      res.status(500).send({ message: "Gagal menghapus testimonial.", error });
    }
  }
}
