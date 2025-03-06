/*
  Warnings:

  - Added the required column `id_evento` to the `convite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `convite` ADD COLUMN `id_evento` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `convite` ADD CONSTRAINT `convite_id_evento_fkey` FOREIGN KEY (`id_evento`) REFERENCES `evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
