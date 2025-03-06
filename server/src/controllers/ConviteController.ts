import { 
    Request, 
    Response
} from "express";

import { 
    retornarErro, 
    tratarCatch 
} from "../functions";
import { 
    IConvite, 
    IConviteParametros 
} from "../interfaces/Convite";
import { handleErrosConviteCadastro } from "../handlers/ConviteHandler";
import ConviteRepository from "../repositories/ConviteRepository";
import UsuarioRepository from "../repositories/UsuarioRepository";
import EventoRepository from "../repositories/EventoRepository";
import ParticipanteRepository from "../repositories/ParticipanteRepository";
import AvaliacoesUsuariosRepository from "../repositories/AvaliacoesUsuariosRepository";

export default {
    async cadastrar(req: Request, res: Response) {

        // resgata dados do convite
        const dadosConvite = req.body as IConvite;
        
        // lida com erros de criação
        const erro = await handleErrosConviteCadastro(dadosConvite) ?? null;
        if(erro) return retornarErro({ mensagem: erro, res }); 
        
        try {

            // cria convite
            const convite = await ConviteRepository.cadastrar(dadosConvite);

            // retorna seus dados
            return res
                .status(200)
                .json({ ...convite })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async atualizar(req: Request, res: Response) {

        const id = req.params.id as string;
        const dadosConvite = req.body as IConvite;

        // lida com erros de criação
        const erro = await handleErrosConviteCadastro(dadosConvite) ?? null;
        if(erro) return retornarErro({ mensagem: erro, res }); 
         
        try {
 
            // cria convite
            const convite = await ConviteRepository.atualizar(parseInt(id), dadosConvite);
 
            // retorna seus dados
            return res
                .status(200)
                .json({ ...convite })
            ;
 
        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async consultar(req: Request, res: Response) {

        // resgata parametros
        const parametrosQuery: any = req.query;
        const parametros = parametrosQuery as IConviteParametros;

        try {
            
            // consulta convite
            const { convites, totalRegistros } = await ConviteRepository.consultar(parametros);
            
            const convitesRetorno = [];
            const totalPaginas = Math.ceil(totalRegistros / parseInt(parametros.registrosPorPagina));

            for (let index = 0; index < convites.length; index++) {

                const convite = convites[index];
                // define o fuso horário em milissegundos
                const fusoHorarioDesejado = -3 * 60 * 60 * 1000;
                const dataCadastroConvite = new Date(new Date(convite.dataCadastro!).getTime() + fusoHorarioDesejado);
                const usuarioEmissor = await UsuarioRepository.consultarId(convite.idUsuarioEmissor.toString());
                const { senha, ...rest } = usuarioEmissor!;

                // resgata média da nota do participante
                const avaliacaoUsuario = await AvaliacoesUsuariosRepository.consultarIdUsuarioAvaliado(usuarioEmissor!.id);
                
                convitesRetorno.push({
                    ...convite,
                    dataCadastro: dataCadastroConvite,
                    usuarioEmissor: {
                        ...rest,
                        nota: (avaliacaoUsuario?._avg ? avaliacaoUsuario._avg.nota : null)
                    }
                });
                
            }

            // retorna seus dados
            return res
                .status(200)
                .json({
                    convites: convitesRetorno,
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

        const dadosConvite = await ConviteRepository.consultarId(parseInt(id));
        if(!dadosConvite) return retornarErro({ mensagem: 'Convite não encontrado', res }); 

        try {

            // remove convite
            await ConviteRepository.deletar(parseInt(id));

            // retorna seus dados
            return res
                .status(200)
                .json(true);

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async aceitar(req: Request, res: Response) {

        const id = req.params.id as string;

        // resgata dados do convite
        const dadosConvite = await ConviteRepository.consultarId(parseInt(id));        

        // caso não encontrou
        if(!dadosConvite) return retornarErro({ mensagem: 'Convite não encontrado', res });

        // consulta evento
        const dadosEvento = await EventoRepository.consultarId(dadosConvite.idEvento+'');

        // caso não encontrou
        if(!dadosEvento) return retornarErro({ mensagem: 'Evento não encontrado', res });

        // consulta participantes do evento
        const participantes = await ParticipanteRepository.consultarParticipantes({
            idEvento: dadosEvento.id
        });

        // resgata o total de participantes
        const totalParticipantes = participantes.totalRegistros;

        // verifica se o total de participantes já atingiu o limite de participantes do evento
        if(totalParticipantes >= dadosEvento.limiteParticipantes) {

            // remove convite
            await ConviteRepository.deletar(parseInt(id));

            // retorna erro de limite 
            return retornarErro({ mensagem: 'O limite máximo de participantes do evento foi atingido!', res });

        }

        try {

            // cadastra o participante no evento
            const participante = await ParticipanteRepository.cadastrar({
                idEvento: dadosEvento.id,
                idUsuario: dadosConvite.tipo === "criador_participante" ? dadosConvite.idUsuarioDestinatario :  dadosConvite.idUsuarioEmissor
            });
            
            // resgata dados do usuário
            const dadosUsuario = await UsuarioRepository.consultarId(participante.idUsuario+'');

            // remove convite
            await ConviteRepository.deletar(parseInt(id));

            // retorna seus dados
            return res
                .status(200)
                .json({
                    nomeParticipante: dadosUsuario?.nome,
                    dadosEvento
                })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async consultarQuantidade(req: Request, res: Response) {

        const idUsuario = req.params.id as string;
        
        try {

            const quantidade = await ConviteRepository.consultarQuantidade(idUsuario);

            // retorna seus dados
            return res
                .status(200)
                .json({quantidade})
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    }
}