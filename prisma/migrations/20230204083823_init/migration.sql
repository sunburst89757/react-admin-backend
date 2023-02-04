-- CreateTable
CREATE TABLE `Button` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `pathname` VARCHAR(191) NOT NULL,
    `add` BOOLEAN NOT NULL DEFAULT true,
    `delete` BOOLEAN NOT NULL DEFAULT true,
    `edit` BOOLEAN NOT NULL DEFAULT true,
    `upload` BOOLEAN NOT NULL DEFAULT true,
    `download` BOOLEAN NOT NULL DEFAULT true,
    `review` BOOLEAN NOT NULL DEFAULT true,
    `submit` BOOLEAN NOT NULL DEFAULT true,
    `audit` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Button` ADD CONSTRAINT `Button_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
