-- AddForeignKey
ALTER TABLE `avaliacoes_usuarios` ADD CONSTRAINT `avaliacoes_usuarios_id_usuario_avaliador_fkey` FOREIGN KEY (`id_usuario_avaliador`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes_usuarios` ADD CONSTRAINT `avaliacoes_usuarios_id_usuario_alvo_fkey` FOREIGN KEY (`id_usuario_alvo`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
