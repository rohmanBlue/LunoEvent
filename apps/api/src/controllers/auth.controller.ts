import prisma from '../prisma';
import { sendEmail } from '../utils/emailResetPass';
import { hashPassword } from '../utils/hash';
import { createToken } from '../utils/sign';
import { generateRandomId } from '../utils/randomGenerator';
import { compareSync } from 'bcrypt';
import { error } from 'console';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
  
export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, confirmPassword, refCode, role } = req.body;

      const findEmailExist = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (findEmailExist) {
        return res.status(401).send({
          success: false,
          message: 'Email already exist. Please choose another email',
        });
      }

      const referralCode = uuidv4().substring(0, 8);
      const identificationId = generateRandomId();

      if (refCode) {
        const findUser = await prisma.user.findFirst({
          where: {
            referralCode: refCode,
          },
        });

        const addPoints = Math.round(findUser?.points || 0 + 10000);
        await prisma.user.update({
          data: {
            points: addPoints,
          },
          where: {
            email: findUser?.email,
          },
        });

        const dateNow = new Date();
        const validToDate = new Date(dateNow);
        validToDate.setMonth(dateNow.getMonth() + 3);
        const validTo = validToDate.toISOString();
        const code = generateRandomId();
        await prisma.point.create({
          data: {
            userId: findUser?.id || 0,
            amount: 10000,
            validFrom: new Date().toISOString(),
            validTo: validTo,
          },
        });

        const discountID = await prisma.discountcode.create({
          data: {
            code: code,
            amount: 5000, 
            validFrom: new Date().toISOString(),
            validTo: validTo,
            codeStatus: 'AVAILABLE',
            limit: 1,
          },
        });

        const user = await prisma.user.create({
          //include userId in userProfile so it can be getUserProfile in profileController
          data: {
            email: email,
            password: await hashPassword(password),
            identificationId: identificationId,
            referralCode: referralCode,
            referredBy: findUser?.id,
            role: role, 
            balance: 0, 
            discountusage: {
              create: {
                discountId: discountID.id,
              },
            },
          },
        });

        const token = createToken({ id: user.id, email: user.email }, '24h');

        return res.status(200).send({
          success: true,
          message: 'your account is created',
          result: {
            email: user.email,
            token: token,
          },
        });
      } else {
        const user = await prisma.user.create({
          data: {
            email: email,
            password: await hashPassword(password),
            identificationId: identificationId,
            referralCode: referralCode,
            role: role, 
            balance: 0, 
            points: 0,
          },
        });

        const token = createToken({ id: user.id, email: user.email }, '24h');

        console.log(identificationId);

        return res.status(201).send({
          success: true,
          message: 'Your account is created',
          result: {
            email: user.email, 
            user: user,
            token: token,
            identificationId: identificationId,
            referralCode: referralCode,
          },
        });
      }
    } catch (error) {
      console.log(error);

      next({
        success: false,
        message: 'Failed to register',
      });
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
            image: findProfile?.image,
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

