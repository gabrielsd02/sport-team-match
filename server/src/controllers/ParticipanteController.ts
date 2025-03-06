import { 
    Request, 
    Response
} from "express";

import { 
    adicionarHoraMinutoData, 
    retornarErro, 
    tratarCatch 
} from "../functions";
import { BodyParticipanteConsulta } from "../interfaces/Participante";
import ParticipanteRepository from "../repositories/ParticipanteRepository";
import UsuarioRepository from "../repositories/UsuarioRepository";
import AvaliacoesUsuariosRepository from "../repositories/AvaliacoesUsuariosRepository";
import EventoRepository from "../repositories/EventoRepository";

export default {
    async consultarParticipantesEvento(req: Request, res: Response) {

        // resgata parametros
        const idEvento = req.params.idEvento as string;
        const parametrosQuery: any = req.query;
        const parametros = parametrosQuery as BodyParticipanteConsulta;
        
        try {

            const { participantes, totalRegistros } = await ParticipanteRepository.consultarParticipantes({
                ...parametros,
                idEvento: parseInt(idEvento)
            });

            let participantesRetorno: any[] = [];
            const totalPaginas = Math.ceil(totalRegistros / parseInt(parametros.registrosPorPagina));

            // percorre participantes do evento
            for (let index = 0; index < participantes.length; index++) {

                const participante = participantes[index];                  

                // resgata dados do usuario do participante
                const dadosUsuario = await UsuarioRepository.consultarId(participante.idUsuario.toString());
                
                // resgata média da nota do participante
                const avaliacaoUsuario = await AvaliacoesUsuariosRepository.consultarIdUsuarioAvaliado(dadosUsuario!.id);
                
                // adiciona informações específicas ao array
                participantesRetorno = participantesRetorno.concat({
                    id: participante.id,
                    idUsuario: participante.idUsuario,
                    idEvento: participante.idEvento,
                    nome: dadosUsuario?.nome,
                    sexo: dadosUsuario?.sexo,
                    dataNascimento: dadosUsuario?.dataNascimento,
                    telefone: dadosUsuario?.telefone,
                    foto: dadosUsuario?.foto,
                    nota: (avaliacaoUsuario?._avg ? avaliacaoUsuario._avg.nota : null)
                });
                
            }

            // resgata dados do evento
            const dadosEvento = await EventoRepository.consultarId(idEvento.toString());

            // retorna seus dados
            return res
                .status(200)
                .json({
                    participantes: participantesRetorno,
                    dadosEvento,
                    totalRegistros,
                    totalPaginas
                })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async deletar(req: Request, res: Response) {

        const id = req.params.id as string;

        const dadosParticipante = await ParticipanteRepository.consultarId(parseInt(id));
        if(!dadosParticipante) return retornarErro({ mensagem: 'Participante não encontrado', res }); 

        try {

            // remove o participante
            await ParticipanteRepository.deletar(parseInt(id));

            // retorna seus dados
            return res
                .status(200)
                .json(true);

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async deletarUsuarioEvento(req: Request, res: Response) {

        // resgata o id do evento e o id do usuario para remover do evento
        const idEvento = req.params.idEvento as string;
        const idUsuario = req.body.idUsuario as string;

        if(!idEvento) return retornarErro({ mensagem: 'Evento não encontrado', res }); 
        if(!idUsuario) return retornarErro({ mensagem: 'Participante não encontrado', res }); 

        // resgata os dados do participantes a partir do id de seu usuario e do evento em questão
        const dadosParticipante = await ParticipanteRepository.consultarUsuarioEvento(parseInt(idEvento), parseInt(idUsuario));

        // se não encontrou os dados, retorna erro
        if(!dadosParticipante) return retornarErro({ mensagem: 'Participante não encontrado', res }); 

        try {

            // remove o participante
            await ParticipanteRepository.deletar(dadosParticipante.id);

            // retorna seus dados
            return res
                .status(200)
                .json(true)
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    }
}