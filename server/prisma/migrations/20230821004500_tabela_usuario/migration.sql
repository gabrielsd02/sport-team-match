-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(30) NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `senha` TINYTEXT NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `foto` LONGTEXT NULL,
    `telefone` VARCHAR(30) NULL,
    `sexo` CHAR(1) NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
