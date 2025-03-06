import {
    Request,
    Response
} from 'express';
import { tratarCatch } from '../functions';
import CategoriaRepository from '../repositories/CategoriaRepository';

export default {
    async consultar(req: Request, res: Response) {

        try {                        

            // consulta categorias
            const categorias = await CategoriaRepository.consultar();

            // retorna seus dados
            return res
                .status(200)
                .json(categorias)
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    }
}