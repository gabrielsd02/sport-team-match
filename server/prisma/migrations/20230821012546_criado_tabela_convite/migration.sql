-- AlterTable
ALTER TABLE `avaliacoes_usuarios` MODIFY `comentario` TEXT NULL;

-- CreateTable
CREATE TABLE `convite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario_emissor` INTEGER NOT NULL,
    `id_usuario_destinatario` INTEGER NOT NULL,
    `descricao` TINYTEXT NULL,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` CHAR(1) NOT NULL DEFAULT 'S',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `convite` ADD CONSTRAINT `convite_id_usuario_emissor_fkey` FOREIGN KEY (`id_usuario_emissor`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `convite` ADD CONSTRAINT `convite_id_usuario_destinatario_fkey` FOREIGN KEY (`id_usuario_destinatario`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
