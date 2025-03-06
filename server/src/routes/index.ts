import { Router } from "express";

import RotasUsuario from "./usuario.routes";
import RotasEvento from "./evento.routes";
import RotasCategoria from "./categoria.routes";
import RotasConvite from "./convite.route";
import RotasParticipante from "./participante.route";
import RotasAvaliacoes from "./avaliacoes.routes";

class Rotas {
    public router: Router;
    constructor() {
        this.router = Router(); 
        this.inicializarRotas();
    }

    inicializarRotas() {
        RotasUsuario(this.router);
        RotasEvento(this.router);
        RotasCategoria(this.router);
        RotasConvite(this.router);
        RotasParticipante(this.router);
        RotasAvaliacoes(this.router);
    }

}

export default Rotas;