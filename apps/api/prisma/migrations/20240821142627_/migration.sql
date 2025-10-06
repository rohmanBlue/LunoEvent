/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `discountcode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `discountcode` MODIFY `code` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `discountcode_code_key` ON `discountcode`(`code`);
