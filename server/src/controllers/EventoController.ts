import { 
    Request, 
    Response
} from "express";
import { isBefore } from "date-fns";

import { 
    adicionarHoraMinutoData, 
    retornarErro, 
    tratarCatch 
} from "../functions";
import { 
    BodyEventoConsulta, 
    IEvento 
} from "../interfaces/Evento";
import { handleErrosEventoSalvar } from "../handlers/EventoHandler";
import UsuarioRepository from "../repositories/UsuarioRepository";
import CategoriaRepository from "../repositories/CategoriaRepository";
import EventoRepository from "../repositories/EventoRepository";
import ParticipanteRepository from "../repositories/ParticipanteRepository";
import ConviteRepository from "../repositories/ConviteRepository";

export default {
    async consultar(req: Request, res: Response) {

        // resgata parametros
        const parametrosQuery: any = req.query;
        const parametros = parametrosQuery as BodyEventoConsulta & { idUsuarioCriador: string };
        
        try {
            
            // consultou usuário
            const { eventos, totalRegistros } = await EventoRepository.consultaEventos({
                ...parametros
            });
            
            const eventosRetorno = [];
            const totalPaginas = Math.ceil(totalRegistros / parseInt(parametros.registrosPorPagina));
            
            for (let index = 0; index < eventos.length; index++) {

                const evento = eventos[index];
                const categoria = await CategoriaRepository.consultarId(evento.idCategoria.toString());
                const duracao = evento.duracao.toLocaleTimeString('pt-BR', {timeZone: 'UTC'});
                const horaDuracao = Number(duracao.split(':')[0]);
                const minutoDuracao = Number(duracao.split(':')[1]);
                const dataSomadaDuracao = adicionarHoraMinutoData(evento.dataHoraInicio, horaDuracao, minutoDuracao);

                // define o fuso horário em milissegundos
                const fusoHorarioDesejado = -3 * 60 * 60 * 1000;
                
                // cria um objeto Date com o fuso horário desejado              
                const dataHoraComFuso = new Date(new Date().getTime() + fusoHorarioDesejado);

                // resgata participantes do evento
                const participantes = await ParticipanteRepository.consultarParticipantes({
                    idEvento: evento.id
                });
                
                eventosRetorno.push({
                    ...{
                        ...evento,
                        duracao,
                        totalParticipantes: participantes.totalRegistros,
                        encerrado: isBefore(dataSomadaDuracao, dataHoraComFuso)
                    }, 
                    categoria
                });
                
            }

            // consulta categorias do sistema
            const categorias = await CategoriaRepository.consultar();

            // retorna seus dados
            return res
                .status(200)
                .json({
                    eventos: eventosRetorno,
                    totalRegistros,
                    categorias,
                    totalPaginas
                })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async consultarMapa(req: Request, res: Response) {

        const idUsuarioDesconsiderar = req.params.idUsuario as string;

        try {
            
            // consultou usuário
            const { eventos, totalRegistros } = await EventoRepository.consultaEventosMapa(idUsuarioDesconsiderar);
            
            const eventosRetorno = [];
            
            for (let index = 0; index < eventos.length; index++) {

                const evento = eventos[index];
                const categoria = await CategoriaRepository.consultarId(evento.idCategoria.toString());
                const duracao = evento.duracao.toLocaleTimeString('pt-BR', {timeZone: 'UTC'});
                const horaDuracao = Number(duracao.split(':')[0]);
                const minutoDuracao = Number(duracao.split(':')[1]);
                const dataSomadaDuracao = adicionarHoraMinutoData(evento.dataHoraInicio, horaDuracao, minutoDuracao);

                // define o fuso horário em milissegundos
                const fusoHorarioDesejado = -3 * 60 * 60 * 1000;
                
                // cria um objeto Date com o fuso horário desejado              
                const dataHoraComFuso = new Date(new Date().getTime() + fusoHorarioDesejado);

                // resgata participantes do evento
                const participantes = await ParticipanteRepository.consultarParticipantes({
                    idEvento: evento.id
                });
                
                eventosRetorno.push({
                    ...{
                        ...evento,
                        duracao,
                        totalParticipantes: participantes.totalRegistros,
                        encerrado: isBefore(dataSomadaDuracao, dataHoraComFuso)
                    }, 
                    categoria
                });
                
            }

            // retorna seus dados
            return res
                .status(200)
                .json({
                    eventos: eventosRetorno,
                    totalRegistros
                })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async consultarId(req: Request, res: Response) {

        const id = req.params.id as string;
        
        // caso não foi passado
        if(!id) return retornarErro({ 
            mensagem: "ID do evento é obrigatório", 
            res 
        });

        try {

            // consultou evento
            const evento = await EventoRepository.consultarId(id);
            
            // caso o evento não foi encontrado
            if(!evento) return retornarErro({ 
                mensagem: "Evento não encontrado", 
                res 
            });

            const duracao = evento.duracao.toLocaleTimeString('pt-BR', {timeZone: 'UTC'});            
            const categoria = await CategoriaRepository.consultarId(evento.idCategoria.toString());            
            const horaDuracao = Number(duracao.split(':')[0]);
            const minutoDuracao = Number(duracao.split(':')[1]);
            const dataSomadaDuracao = adicionarHoraMinutoData(evento.dataHoraInicio, horaDuracao, minutoDuracao);
            
            // define o fuso horário em milissegundos
            const fusoHorarioDesejado = -3 * 60 * 60 * 1000;

            // cria um objeto Date com o fuso horário desejado
            const dataHoraComFuso = new Date(new Date().getTime() + fusoHorarioDesejado);
            
            const eventoRetorno = Object.assign(evento, {
                duracao,
                categoria,
                encerrado: isBefore(dataSomadaDuracao, dataHoraComFuso)
            });

            // consulta categorias
            const categorias = await CategoriaRepository.consultar();

            // resgata dados do usuario criador
            const usuarioCriador = await UsuarioRepository.consultarId(evento.idUsuarioCriador.toString());

            const { participantes, totalRegistros } = await ParticipanteRepository.consultarParticipantes({
                idEvento: eventoRetorno.id
            });

            // mapeia ids dos participantes
            const idsUsuariosParticipantes = participantes.map(p => p.idUsuario);

            // consulta convites do evento
            const convitesEvento = await ConviteRepository.consultarConvitesEvento(parseInt(id));
            
            // retorna seus dados
            return res
                .status(200)
                .json({ 
                    evento: eventoRetorno,
                    totalParticipantes: totalRegistros,
                    convitesEvento,
                    idsUsuariosParticipantes,
                    usuarioCriador,
                    categorias
                })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async cadastrar(req: Request, res: Response) {

        // resgata dados do usuário
        const dadosEvento = req.body as IEvento;
        
        // lida com erros de criação
        const erro = await handleErrosEventoSalvar(dadosEvento) ?? null;
        if(erro) return retornarErro({ mensagem: erro, res }); 
        
        // consulta usuário no banco
        const existeUsuario = await UsuarioRepository
            .consultarId(dadosEvento.idUsuarioCriador.toString())
        ;
        
        // caso não exista, retona erro
        if(!existeUsuario) return retornarErro({ 
            mensagem: "Usuário inexistente!", 
            res 
        });

        // consulta categoria no banco
        const existeCategoria = await CategoriaRepository
            .consultarId(dadosEvento.idCategoria.toString())
        ;

        // caso não exista, retona erro
        if(!existeCategoria) return retornarErro({ 
            mensagem: "Categoria inexistente!", 
            res 
        });

        try {  

            // cria novo evento
            const novoEvento = await EventoRepository.cadastrar(dadosEvento);

            // adiciona criador aos participantes
            await ParticipanteRepository.cadastrar({
                idEvento: novoEvento.id,
                idUsuario: novoEvento.idUsuarioCriador
            });

            // retorna seus dados
            return res
                .status(200)
                .json({ ...novoEvento })
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    },
    async atualizar(req: Request, res: Response) {

        const id = req.params.id as string;
        const dadosEvento = req.body as IEvento;
        
        // lida com erros de criação
        const erro = await handleErrosEventoSalvar(dadosEvento, id) ?? null;
        if(erro) return retornarErro({ mensagem: erro, res }); 

        // consulta categoria no banco
        const existeCategoria = await CategoriaRepository
            .consultarId(dadosEvento.idCategoria.toString())
        ;

        // caso não exista, retona erro
        if(!existeCategoria) return retornarErro({ 
            mensagem: "Categoria inexistente!", 
            res 
        });

        try {                        

            // atualiza evento
            const eventoAtualizado = await EventoRepository
                .atualizar(parseInt(id), dadosEvento)
            ;

            // retorna seus dados
            return res
                .status(200)
                .json({ ...eventoAtualizado })
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    },
    async consultarEventosUsuario(req: Request, res: Response) {

        // resgata parametros
        const idUsuario = req.params.idUsuario as string;
        const parametrosQuery: any = req.query;
        const parametros = parametrosQuery as BodyEventoConsulta;
        
        try {

            // consultou usuário
            const { eventos, totalRegistros } = await EventoRepository.consultarEventosUsuario({
                ...parametros,
                idUsuario
            });
            
            const eventosRetorno = [];
            const totalPaginas = Math.ceil(totalRegistros / parseInt(parametros.registrosPorPagina));
            for (let index = 0; index < eventos.length; index++) {

                const evento = eventos[index];                
                const categoria = await CategoriaRepository.consultarId(evento.idCategoria.toString());                
                const duracao = evento.duracao.toLocaleTimeString('pt-BR', {timeZone: 'UTC'});
                const horaDuracao = Number(duracao.split(':')[0]);
                const minutoDuracao = Number(duracao.split(':')[1]);
                const dataSomadaDuracao = adicionarHoraMinutoData(evento.dataHoraInicio, horaDuracao, minutoDuracao);                

                // define o fuso horário em milissegundos
                const fusoHorarioDesejado = -3 * 60 * 60 * 1000;
                
                // cria um objeto Date com o fuso horário desejado       
                const dataHoraComFuso = new Date(new Date().getTime() + fusoHorarioDesejado);

                // resgata participantes do evento
                const participantes = await ParticipanteRepository.consultarParticipantes({
                    idEvento: evento.id
                });
                
                eventosRetorno.push({
                    ...{
                        ...evento,
                        duracao,
                        totalParticipantes: participantes.totalRegistros,
                        encerrado: isBefore(dataSomadaDuracao, dataHoraComFuso)
                    }, 
                    categoria
                });
                
            }

            // consulta categorias do sistema
            const categorias = await CategoriaRepository.consultar();

            // retorna seus dados
            return res
                .status(200)
                .json({
                    eventos: eventosRetorno,
                    totalRegistros,
                    categorias,
                    totalPaginas
                })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async deletar(req: Request, res: Response) {

        const id = req.params.id as string;

        const dadosEvento = EventoRepository.consultarId(id);

        // caso não exista, retona erro
        if(!dadosEvento) return retornarErro({ 
            mensagem: "Evento não encontrado!", 
            res 
        });

        try {                        

            // atualiza evento
            await EventoRepository.deletar(parseInt(id));

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