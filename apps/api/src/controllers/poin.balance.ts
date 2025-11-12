import { Request, Response } from 'express';
import prisma from '../prisma';

export class PointBalanceController {
  async updateBalance(req: Request, res: Response) {
    try {
      let userId = res.locals.decrypt?.id;
      if (!userId)
        return res.status(400).send({ message: 'User not authenticated' });
      userId = Number(userId);

      const { balance, referralCode, points } = req.body; // ✅ tambahkan points
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).send({ message: 'User not found' });

      let pointsToAdd = 0;
      let balanceToAdd = 0;

      // === 1️⃣ Topup balance ===
      if (balance !== undefined) {
        if (balance < 10000 || balance > 1000000)
          return res.status(400).send({
            success: false,
            message: 'Topup minimal 10.000 & maksimal 1.000.000',
          });

        balanceToAdd = balance;
        pointsToAdd += 20; // ✅ perbaikan logika poin
      }

      // === 2️⃣ Tukar points ke balance ===
      if (points !== undefined) {
        if (points < 10000 || points > 1000000)
          return res.status(400).send({
            success: false,
            message: 'Minimal 10.000 & maksimal 1.000.000 points',
          });

        if (user.points < points)
          return res.status(400).send({
            success: false,
            message: 'Points tidak cukup',
          });

        // kurangi points, tambahkan balance
        balanceToAdd += points;
        pointsToAdd -= points;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          balance: user.balance + balanceToAdd,
          points: user.points + pointsToAdd,
        },
      });

      // === History ===
      if (balanceToAdd > 0)
        await prisma.balanceHistory.create({
          data: {
            userId,
            type: balance ? 'credit' : 'convert', // credit = topup, convert = dari points
            amount: balanceToAdd,
            description:
              balance !== undefined
                ? `Topup ${balanceToAdd}, point +${pointsToAdd}`
                : `Convert ${points * -1} points ke balance ${points}`,
          },
        });

      res.status(200).send({
        success: true,
        message: `Update berhasil! Saldo +${balanceToAdd}, point ${pointsToAdd >= 0 ? '+' : ''}${pointsToAdd}`,
        result: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ success: false, message: 'Gagal update balance / points' });
    }
  }

  async getBalance(req: Request, res: Response) {
    try {
      let userId = res.locals.decrypt?.id;
      if (!userId)
        return res.status(400).send({ message: 'User not authenticated' });
      userId = Number(userId);
      if (isNaN(userId))
        return res.status(400).send({ message: 'Invalid user ID from token' });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          balance: true,
          points: true,
          balanceHistory: { orderBy: { createdAt: 'desc' }, take: 10 },
          discountusage: {
            orderBy: { usedAt: 'desc' },
            take: 10,
            include: { discountcode: true },
          },
        },
      });

      if (!user) return res.status(404).send({ message: 'User not found.' });
      res.status(200).send({ success: true, result: user });
    } catch (error) {
      console.error('Error fetching balance:', error);
      res
        .status(500)
        .send({
          success: false,
          message: 'Failed to retrieve balance and points.',
        });
    }
  }
}
