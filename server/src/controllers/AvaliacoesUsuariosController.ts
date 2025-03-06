import {
    Request,
    Response
} from 'express';

import { 
    IAvaliacaoUsuarios, 
    IConsultarParams 
} from '../interfaces/AvaliacoesUsuarios';
import { tratarCatch } from '../functions';
import AvaliacoesUsuariosRepository from '../repositories/AvaliacoesUsuariosRepository';

export default {
    async consultar(req: Request, res: Response) {

        // resgata parametros
        const parametrosQuery: any = req.query;
        const parametros = parametrosQuery as IConsultarParams;
        
        try {                        

            // consulta avaliacao
            const avaliacaoUsuario = await AvaliacoesUsuariosRepository.consultar(parametros);

            // retorna seu dado
            return res
                .status(200)
                .json(avaliacaoUsuario)
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    },
    async cadastrar(req: Request, res: Response) {

        // resgata parametros
        const parametrosQuery: any = req.body;
        const parametros = parametrosQuery as IAvaliacaoUsuarios;
        
        try {                        

            // consulta avaliacao
            const avaliacaoUsuario = await AvaliacoesUsuariosRepository.cadastrar(parametros);

            // retorna seu dado
            return res
                .status(200)
                .json(avaliacaoUsuario)
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    },
    async atualizar(req: Request, res: Response) {

        // resgata parametros
        const id = req.params.id as string;
        const parametrosQuery: any = req.body;
        const parametros = parametrosQuery as IAvaliacaoUsuarios;
        
        try {                        

            // consulta avaliacao
            const avaliacaoUsuario = await AvaliacoesUsuariosRepository.atualizar({
                id: parseInt(id!),
                ...parametros
            });

            // retorna seu dado
            return res
                .status(200)
                .json(avaliacaoUsuario)
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    }
}