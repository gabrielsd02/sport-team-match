import { Router } from "express";
import { verificarToken } from "../middlewares";
import UsuarioController from "../controllers/UsuarioController";

export default function RotasUsuario(router: Router) {
    const rota = '/usuario';
    router.get(rota, verificarToken, UsuarioController.consultar);
    router.get(rota+'/:id', verificarToken ,UsuarioController.consultarId);
    router.put(rota+'/:id', verificarToken, UsuarioController.atualizar);
    router.post(rota+'/cadastro', UsuarioController.criar);
    router.post(rota+'/login', UsuarioController.login);
    router.post(rota+'/codigo-redefinicao/:id', UsuarioController.verificarCodigo);
    router.post(rota+'/redefinicao', UsuarioController.verificarEmail);
    router.post(rota+'/redefinicao/:id', UsuarioController.atualizarSenha);
    router.post(rota+'/login/:email', UsuarioController.loginEmail);
}