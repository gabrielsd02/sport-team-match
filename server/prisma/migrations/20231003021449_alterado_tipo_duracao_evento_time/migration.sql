/*
  Warnings:

  - You are about to alter the column `duracao` on the `evento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `Time`.

*/
-- AlterTable
ALTER TABLE `evento` MODIFY `duracao` TIME NOT NULL;
