-- AlterTable
ALTER TABLE `user` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `isValid` BOOLEAN NOT NULL DEFAULT true;
