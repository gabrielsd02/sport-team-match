import { Router } from "express";
import { verificarToken } from "../middlewares";
import AvaliacoesUsuariosController from "../controllers/AvaliacoesUsuariosController";

export default function RotasAvaliacoes(router: Router) {
    const rota = '/avaliacoes';
    router.get(rota, verificarToken, AvaliacoesUsuariosController.consultar);
    router.post(rota, verificarToken, AvaliacoesUsuariosController.cadastrar);
    router.put(rota+'/:id', verificarToken, AvaliacoesUsuariosController.atualizar);
}