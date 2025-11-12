import prisma from '../prisma';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export class ProfileController {
  // GET profile
  async getProfileUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Token not found' });
      }

      const profile = await prisma.userprofile.findFirst({
        where: { userId },
        select: {
          firstName: true,
          lastName: true,
          gender: true,
          address: true,
          phoneNumber: true,
          dateOfBirth: true,
          isAdded: true,
          location: { select: { locationName: true } },
          image: true,
          user: { select: { email: true } },
        },
      });

      if (!profile) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, result: profile });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to get profile' });
    }
  }

  // ADD profile
async addProfileUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.decrypt?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Token not found' });
    }

    // Ambil data dari body, beri default agar tidak null
    const {
      firstName = "",
      lastName = "",
      gender = "",
      address = "",
      phoneNumber = "",
      dateOfBirth,
      location = ""
    } = req.body;

    const findUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!findUser) return res.status(404).json({ success: false, message: 'User not found' });

    // Validasi location
    let loc = await prisma.location.findFirst({ where: { locationName: location } });
    if (!loc) {
      loc = await prisma.location.create({ data: { locationName: location } });
    }

    // Validasi dateOfBirth
    let dob: string | null = null;
    if (dateOfBirth) {
      const parsedDate = new Date(dateOfBirth);
      if (!isNaN(parsedDate.getTime())) dob = parsedDate.toISOString();
    }

    const profile = await prisma.userprofile.create({
      data: {
        userId,
        firstName,
        lastName,
        gender,
        address,
        phoneNumber,
        dateOfBirth: dob,
        image: req.file ? `/assets/profile/${req.file.filename}` : null,
        locationId: loc.id,
        isAdded: true,
      },
    });

    return res.status(200).json({ success: true, message: 'Profile added successfully', result: profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to add profile', error });
  }
}

  // UPDATE profile
 async updateProfileUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.decrypt?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Token not found' });
    }

    // Ambil field dari body, beri default ke profile lama
    const profile = await prisma.userprofile.findFirst({ where: { userId } });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const {
      firstName = profile.firstName || "",
      lastName = profile.lastName || "",
      gender = profile.gender || "",
      address = profile.address || "",
      phoneNumber = profile.phoneNumber || "",
      dateOfBirth
    } = req.body;

    // Hapus image lama jika ada
    if (req.file && profile.image) {
      const oldImagePath = path.join(__dirname, '../../public', profile.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

   // Validasi dateOfBirth
      let dob = profile.dateOfBirth;
      if (dateOfBirth) {
        const parsedDate = new Date(dateOfBirth);
        if (!isNaN(parsedDate.getTime())) dob = new Date(dateOfBirth)
      }

    const updated = await prisma.userprofile.update({
      where: { id: profile.id },
      data: {
        firstName,
        lastName,
        gender,
        address,
        phoneNumber,
        dateOfBirth: dob,
        image: req.file ? `/assets/profile/${req.file.filename}` : profile.image,
      },
    });

    return res.status(200).json({ success: true, message: 'Profile updated successfully', result: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to update profile', error });
  }
}
}
