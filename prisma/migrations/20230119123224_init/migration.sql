/*
  Warnings:

  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `size` VARCHAR(191) NOT NULL,
    MODIFY `identifier` VARCHAR(191) NOT NULL;
