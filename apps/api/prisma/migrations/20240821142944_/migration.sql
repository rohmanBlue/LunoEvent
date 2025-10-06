/*
  Warnings:

  - You are about to alter the column `amount` on the `discountcode` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.

*/
-- AlterTable
ALTER TABLE `discountcode` MODIFY `amount` INTEGER NOT NULL;
