import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../prisma';

export class PointBalanceController {
  async updateBalance(req: Request, res: Response) {
    const { userId } = req.params;
    const { balance, points } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: { balance, points },
      });

      res.send(updatedUser); 
    } catch (error) {
      res.status(500).send({ message: 'Failed to update balance or points.', error });
    }
  }

    async getBalance(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
        select: { balance: true, points: true },
      });

      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      res.send(user);
    } catch (error) {
      res.status(500).send({ message: 'Failed to retrieve balance and points.', error });
    }
  }
}
