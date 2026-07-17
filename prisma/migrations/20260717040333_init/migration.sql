-- CreateTable
CREATE TABLE `analysis_dataset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resumeSummary` LONGTEXT NOT NULL,
    `jobDescription` LONGTEXT NOT NULL,
    `matchScore` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
