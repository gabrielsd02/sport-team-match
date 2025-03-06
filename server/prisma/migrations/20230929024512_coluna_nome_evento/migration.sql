/*
  Warnings:

  - Added the required column `nome` to the `evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `evento` ADD COLUMN `nome` VARCHAR(200) NOT NULL;
