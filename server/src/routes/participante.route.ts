import { Router } from "express";
import { verificarToken } from "../middlewares";
import ParticipanteController from "../controllers/ParticipanteController";

export default function RotasParticipante(router: Router) {
    const rota = '/participante';
    router.get(rota+'/evento/:idEvento', verificarToken, ParticipanteController.consultarParticipantesEvento);
    router.post(rota+'/evento/:idEvento', verificarToken, ParticipanteController.deletarUsuarioEvento);
    router.delete(rota+'/:id', verificarToken, ParticipanteController.deletar);
}