import { Request, Response } from 'express';
import prisma from '../prisma';

export class TransactionController {
  // === CREATE ===
 async createTransaction(req: Request, res: Response) {
    const userId = res.locals.decrypt?.id;
    const { eventId, qty, discountCode } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) },
      });
      const discount = discountCode
        ? await prisma.discountcode.findFirst({
            where: { code: discountCode, codeStatus: 'AVAILABLE' },
          })
        : null;

      if (!user || !event) {
        return res
          .status(404)
          .send({ message: 'User atau Event tidak ditemukan' });
      }

      if (event.totalSeats < qty) {
        return res.status(400).send({ message: 'Kursi tidak cukup' });
      }

      // === Hitung harga dasar ===
      let totalPrice = event.price * qty;

      // === Apply discount jika ada code ===
      if (discount) {
        if (discount.discountPercent) {
          totalPrice -= (totalPrice * discount.discountPercent) / 100;
        } else if (discount.amount) {
          totalPrice -= discount.amount;
        }

        // pastikan diskon tidak negatif
        if (totalPrice < 0) totalPrice = 0;

        // update status discount jadi USED
        await prisma.discountcode.update({
          where: { id: discount.id },
          data: { codeStatus: 'USED' },
        });
      }

      // === Jika user punya referral (referredBy) dan ini pembelian pertama ===
      const hasBoughtBefore = await prisma.ticket.findFirst({
        where: { userId, status: 'PAID' },
      });

      if (!hasBoughtBefore && user.referredBy) {
        // apply diskon referral otomatis (10%)
        totalPrice -= totalPrice * 0.1;

        const refUser = await prisma.user.findUnique({
          where: { id: user.referredBy },
        });

        if (refUser) {
          const expiredAt = new Date();
          expiredAt.setMonth(expiredAt.getMonth() + 3);

          // Tambahkan point ke pemilik referral
          await prisma.user.update({
            where: { id: refUser.id },
            data: { points: (refUser.points || 0) + 10000 },
          });

          // Simpan riwayat poin
          await prisma.point.create({
            data: {
              userId: refUser.id,
              amount: 10000,
              validFrom: new Date(),
              validTo: expiredAt,
               expiredAt: new Date(expiredAt.getTime() + 3 * 30 * 24 * 60 * 60 * 1000), // Assuming you want to set expiredAt to 3 months from now 
            },
          });
        }
      }

      // === Cek saldo user ===
      if (user.role === 'USER' && user.balance < totalPrice) {
        return res.status(400).send({ message: 'Saldo tidak cukup' });
      }

      // === Kurangi saldo & kursi ===
      await prisma.user.update({
        where: { id: userId },
        data: { balance: user.balance - totalPrice },
      });

      await prisma.event.update({
        where: { id: event.id },
        data: { totalSeats: event.totalSeats - qty },
      });

      // === Simpan transaksi ===
      const transaction = await prisma.ticket.create({
        data: {
          userId,
          eventId: event.id,
          qty,
          total: totalPrice,
          status: 'PAID',
        },
      });

      res.status(201).send({
        success: true,
        message: 'Transaksi berhasil dengan referral dan diskon',
        data: transaction,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Gagal membuat transaksi', error });
    }
  } 
  // === READ BY USER (lihat semua transaksi user login) ===
  async readUserTransactions(req: Request, res: Response) {
    const userId = res.locals.decrypt?.id;

    try {
      const transactions = await prisma.ticket.findMany({
        where: { userId },
        include: { event: true },
      });

      res.send({ data: transactions });
    } catch (error) {
      res
        .status(500)
        .send({ message: 'Gagal mengambil data transaksi', error });
    }
  }

  // === READ SINGLE ===
  async readTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const userId = res.locals.decrypt?.id;

    try {
      const transaction = await prisma.ticket.findFirst({
        where: { id: parseInt(id), userId },
        include: { event: true },
      });

      if (!transaction)
        return res.status(404).send({ message: 'Transaksi tidak ditemukan' });

      res.send({ data: transaction });
    } catch (error) {
      res.status(500).send({ message: 'Gagal mengambil transaksi', error });
    }
  }

  // === UPDATE ===
  async updateTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const { qty, discountCode } = req.body;
    const userId = res.locals.decrypt?.id;

    try {
      const transaction = await prisma.ticket.findFirst({
        where: { id: parseInt(id), userId },
        include: { event: true },
      });

      if (!transaction)
        return res.status(404).send({ message: 'Transaksi tidak ditemukan' });

      const event = transaction.event;
      const discount = discountCode
        ? await prisma.discountcode.findFirst({ where: { code: discountCode } })
        : null;

      let totalPrice = event.price * qty;
      if (discount) totalPrice -= discount.amount;

      const updated = await prisma.ticket.update({
        where: { id: parseInt(id) },
        data: { qty, total: totalPrice },
      });

      res.send({ message: 'Transaksi diperbarui', data: updated });
    } catch (error) {
      res.status(500).send({ message: 'Gagal update transaksi', error });
    }
  }

  // === DELETE ===
  async deleteTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const userId = res.locals.decrypt?.id;

    try {
      const transaction = await prisma.ticket.findFirst({
        where: { id: parseInt(id), userId },
      });

      if (!transaction)
        return res.status(404).send({ message: 'Transaksi tidak ditemukan' });

      await prisma.ticket.delete({ where: { id: transaction.id } });

      res.send({ message: 'Transaksi dihapus' });
    } catch (error) {
      res.status(500).send({ message: 'Gagal hapus transaksi', error });
    }
  }
}
