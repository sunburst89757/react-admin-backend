-- CreateTable
CREATE TABLE `Menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `path` VARCHAR(191) NOT NULL,
    `sort` INTEGER NOT NULL,
    `parentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Menu_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleOnMenu` (
    `roleId` INTEGER NOT NULL,
    `menuId` INTEGER NOT NULL,

    PRIMARY KEY (`roleId`, `menuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoleOnMenu` ADD CONSTRAINT `RoleOnMenu_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleOnMenu` ADD CONSTRAINT `RoleOnMenu_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
