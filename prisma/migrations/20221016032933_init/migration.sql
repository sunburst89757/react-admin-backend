/*
  Warnings:

  - Added the required column `updatedAt` to the `RoleOnMenu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `roleonmenu` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isValid` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
