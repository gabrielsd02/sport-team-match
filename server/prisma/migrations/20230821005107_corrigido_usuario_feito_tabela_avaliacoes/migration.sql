-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `ativo` CHAR(1) NOT NULL DEFAULT 'S',
    ADD COLUMN `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `avaliacoes_usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario_avaliador` INTEGER NOT NULL,
    `id_usuario_alvo` INTEGER NOT NULL,
    `nota` DOUBLE NOT NULL,
    `comentario` TEXT NOT NULL,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` CHAR(1) NOT NULL DEFAULT 'S',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
