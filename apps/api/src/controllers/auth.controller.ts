import prisma from '../prisma';
import { sendEmail } from '../utils/emailResetPass';
import { hashPassword } from '../utils/hash';
import { createToken } from '../utils/createToken';
import { generateRandomId } from '../utils/randomGenerator';
import { compareSync } from 'bcrypt';
import { error } from 'console';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, confirmPassword, refCode, role } = req.body;

      if (!email || !password)
        return res
          .status(400)
          .send({ success: false, message: 'Email & password wajib' });

      if (password !== confirmPassword)
        return res
          .status(400)
          .send({ success: false, message: 'Password tidak cocok' });

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser)
        return res
          .status(400)
          .send({ success: false, message: 'Email sudah digunakan' });

      const referralCode = uuidv4().substring(0, 8); // kode referral unik untuk user baru
      const identificationId = Math.random().toString(36).substring(2, 10);

      // pastikan ada lokasi default
      let location = await prisma.location.findFirst({
        where: { locationName: 'Unknown' },
      });
      if (!location)
        location = await prisma.location.create({
          data: { locationName: 'Unknown' },
        });

      const userData: any = {
        email,
        password: await hashPassword(password),
        identificationId,
        referralCode,
        role,
        points: 0,
        balance: 0,
      };

      // === Referral code digunakan ===
      if (refCode) {
        const refUser = await prisma.user.findFirst({
          where: { referralCode: refCode },
        });
        if (!refUser)
          return res
            .status(404)
            .send({ success: false, message: 'Referral code tidak valid' });

        // 1️⃣ Tambah 10.000 poin ke pemilik referral
        const expiredAt = new Date();
        expiredAt.setMonth(expiredAt.getMonth() + 3);

        // await prisma.user.update({
        //   where: { id: refUser.id },
        //   data: { points: (refUser.points || 0) + 10000 },
        // });

        // Simpan riwayat point
        // await prisma.point.create({
        //   data: {
        //     userId: refUser.id,
        //     amount: 10000,
        //     expiredAt,
        //     validFrom: new Date(), // add this line
        //     validTo: new Date(expiredAt.getTime() + 24 * 60 * 60 * 1000),
        //   },
        // });

        // 2️⃣ Buat 10% discount coupon untuk user baru
        const validTo = new Date();
        validTo.setMonth(validTo.getMonth() + 3);

        const discount = await prisma.discountcode.create({
          data: {
            code: uuidv4().substring(0, 8),
            amount: 0, // add this line
            discountPercent: 10,
            validFrom: new Date(),
            validTo,
            codeStatus: 'AVAILABLE',
            limit: 1,
          },
        }); 

        userData.discountusage = {
          create: { discountId: discount.id },
        };

        userData.referredBy = refUser.id;
      }

      // === Buat user baru ===
      const user = await prisma.user.create({ data: userData });

      // === Buat profil user ===
      await prisma.userprofile.create({
        data: {
          userId: user.id,
          firstName: '',
          lastName: '',
          gender: 'MALE',
          address: '',
          phoneNumber: '',
          isAdded: false,
          locationId: location.id,
        },
      });

      // === Generate token ===
      const token = createToken(
        { id: user.id, email: user.email, role: user.role },
        '24h',
      );

      return res.status(201).send({
        success: true,
        message: 'Akun berhasil dibuat',
        result: {
          email: user.email,
          token,
          identificationId,
          referralCode,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      return res
        .status(500)
        .send({ success: false, message: 'Gagal mendaftar' });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const findUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (findUser) {
        const comparePassword = compareSync(password, findUser.password);

        if (!comparePassword) {
          return res.status(401).send({
            success: false,
            message: 'Wrong password inserted',
            error,
          });
        }
        const token = createToken(
          { id: findUser.id, email: findUser.email },
          '24h',
        );

        return res.status(200).send({
          success: true,
          result: {
            role: findUser.role,
            identificationId: findUser.identificationId,
            email: findUser.email,
            points: findUser.points,
            token: token,
          },
        });
      } else {
        throw {
          rc: 404,
          message: 'Account not found',
        };
      }
    } catch (error) {
      next({ success: false, message: 'Failed to login', error });
    }
  }

  async keepLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          id: res.locals.decrypt.id,
        },
      });

      const findProfile = await prisma.userprofile.findFirst({
        where: { userId: res.locals.decrypt.id },
      });

      if (findUser) {
        return res.status(200).send({
          success: true,
          result: {
            email: findUser.email,
            identificationId: findUser.identificationId,
            role: findUser.role,
            points: findUser.points,
            balance: findUser.balance,
            image: findProfile?.image,
            referralCode: findUser.referralCode,
            token: createToken(
              {
                id: findUser.id,
                email: findUser.email,
              },
              '24h',
            ),
          },
        });
      } else {
        return res.status(400).send({
          success: false,
          message: 'Account not found',
        });
      }
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Failed to fetch the data',
      });
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        return res.status(404).send({
          success: false,
          message: 'cannot find your account',
        });
      } else {
        const token = createToken(
          { id: findUser.id, email: findUser.email },
          '20m',
        );

        await sendEmail(findUser.email, 'Password Reset', null, {
          email: findUser.email,
          token,
        });
        return res.status(200).send({
          success: true,
          message: 'Account exist. Please reset your password',
          result: {
            token,
          },
        });
      }
    } catch (error) {
      console.log(error);

      next({ success: false, message: 'Failed to reset your password', error });
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, confirmPassword } = req.body;

      if (res.locals.decrypt.id) {
        await prisma.user.update({
          data: {
            password: await hashPassword(password),
          },
          where: {
            id: res.locals.decrypt.id,
          },
        });

        return res.status(200).send({
          success: true,
          message: 'Successfully reset your password. Please login',
        });
      }
    } catch (error) {
      next({
        success: false,
        message: 'Something went wrong when resetting your password',
        error,
      });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // const token = req.header('Authorization')?.split(' ')[1];
      // if (token) {
      //   await prisma.blacklistToken.create({
      //     data: {
      //       token: token,
      //     },
      //   });
      // }
      return res.status(200).send({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Failed to logout',
      });
    }
  }
}
