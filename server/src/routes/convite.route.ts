import { Router } from "express";
import { verificarToken } from "../middlewares";
import ConviteController from "../controllers/ConviteController";

export default function RotasConvite(router: Router) {
    const rota = '/convite';
    router.get(rota, verificarToken, ConviteController.consultar);
    router.get(rota+'/quantidade/usuario/:id', verificarToken, ConviteController.consultarQuantidade);
    router.post(rota, verificarToken, ConviteController.cadastrar);
    router.post(rota+'/:id/aceitar', verificarToken, ConviteController.aceitar);
    router.put(rota+'/:id', verificarToken, ConviteController.atualizar);
    router.delete(rota+'/:id', verificarToken, ConviteController.deletar);
}