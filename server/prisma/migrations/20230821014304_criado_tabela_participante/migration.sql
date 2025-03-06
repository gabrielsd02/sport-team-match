/*
  Warnings:

  - You are about to alter the column `data_hora_inicio` on the `evento` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `evento` MODIFY `data_hora_inicio` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `participante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_evento` INTEGER NOT NULL,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` CHAR(1) NOT NULL DEFAULT 'S',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `participante` ADD CONSTRAINT `participante_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participante` ADD CONSTRAINT `participante_id_evento_fkey` FOREIGN KEY (`id_evento`) REFERENCES `evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
