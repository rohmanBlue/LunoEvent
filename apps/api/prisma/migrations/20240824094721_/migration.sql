/*
  Warnings:

  - Made the column `balance` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `balance` INTEGER NOT NULL;
