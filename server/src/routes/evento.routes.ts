import { Router } from "express";
import { verificarToken } from "../middlewares";
import EventoController from "../controllers/EventoController";

export default function RotasEvento(router: Router) {
    const rota = '/evento';
    router.get(rota+'/:id', verificarToken, EventoController.consultarId);
    router.get(rota+'/lista/eventos', verificarToken, EventoController.consultar);
    router.get(rota+'/mapa/:idUsuario', verificarToken, EventoController.consultarMapa);
    router.get(rota+'/lista/:idUsuario', verificarToken, EventoController.consultarEventosUsuario);
    router.post(rota, verificarToken, EventoController.cadastrar);
    router.put(rota+'/:id', verificarToken, EventoController.atualizar);
    router.delete(rota+'/:id', verificarToken, EventoController.deletar);
}