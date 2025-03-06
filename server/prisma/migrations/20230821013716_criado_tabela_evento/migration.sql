-- DropForeignKey
ALTER TABLE `convite` DROP FOREIGN KEY `convite_id_usuario_destinatario_fkey`;

-- CreateTable
CREATE TABLE `evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario_criador` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,
    `descricao` VARCHAR(300) NOT NULL,
    `data_hora_inicio` DATETIME NOT NULL,
    `local` VARCHAR(200) NOT NULL,
    `duracao` TIME NOT NULL,
    `valor_entrada` DOUBLE NULL DEFAULT 0,
    `limite_participantes` INTEGER NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` CHAR(1) NOT NULL DEFAULT 'S',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `convite` ADD CONSTRAINT `convite_id_usuario_destinatario_fkey` FOREIGN KEY (`id_usuario_destinatario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evento` ADD CONSTRAINT `evento_id_usuario_criador_fkey` FOREIGN KEY (`id_usuario_criador`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evento` ADD CONSTRAINT `evento_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
