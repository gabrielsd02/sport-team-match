import { Router } from "express";
import { verificarToken } from "../middlewares";
import CategoriaController from "../controllers/CategoriaController";

export default function RotasCategoria(router: Router) {
    const rota = '/categoria';
    router.get(rota, verificarToken, CategoriaController.consultar);
}