import { Prisma } from "@prisma/client";

import { prisma } from "../database";
import { toCamelCase } from '../functions';
import { DatabaseError } from "../exceptions";
import { 
    BodyEventoConsulta, 
    IEvento
} from "../interfaces/Evento";

export default {
    async cadastrar(dados: IEvento) {        

        try {

            const valorEntrada = dados.valorEntrada ? parseFloat(dados.valorEntrada.toString().replace(',', '.')) : null;
            const [{ duracao }]: any = await prisma.$queryRaw`SELECT TIME(${dados.duracao}) as duracao`;
            
            const evento = await prisma.evento.
                create({
                    data: {
                        ...dados,
                        duracao,
                        valorEntrada,
                        limiteParticipantes: parseInt(dados.limiteParticipantes.toString())
                    }
                })
            ;
            return evento;

        } catch(e: any) {
            console.error(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }

    },
    async atualizar(id: number, dados: IEvento) {
        try {

            const valorEntrada = dados.valorEntrada ? parseFloat(dados.valorEntrada.toString().replace(',', '.')) : null;
            const [{ duracao }]: any = await prisma.$queryRaw`SELECT TIME(${dados.duracao}) as duracao`;
            
            const evento = await prisma.evento.
                update({ 
                    where: {
                        id
                    },
                    data: {
                        ...dados,
                        duracao,
                        valorEntrada,
                        limiteParticipantes: parseInt(dados.limiteParticipantes.toString())
                    } 
                })
            ;
            return evento;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }        
    },
    async consultaEventos(parametros: BodyEventoConsulta & { idUsuarioCriador: string }) {
        try {

            const pagina = parseInt(parametros.pagina);
            const registrosPorPagina = parseInt(parametros.registrosPorPagina);
            const skip = (pagina - 1) * registrosPorPagina; 
            const idUsuarioCriador = parseInt(parametros.idUsuarioCriador);
                        
            const eventosComDuracao: Prisma.EventoGetPayload<Prisma.EventoFindManyArgs>[] = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    e.*,
                    if(
                        exists(
                        
                            select
                                id
                            from participante
                            where id_evento = e.id
                            and id_usuario = ${Prisma.sql`${idUsuarioCriador}`}
                                
                        ), "S", "N"
                    ) as participando
                from evento e
                where 
                    e.id_usuario_criador != ${idUsuarioCriador}
                    and ADDTIME(e.data_hora_inicio, e.duracao) >= NOW()
                    and (
                        (
                            exists(
                                select
                                    id
                                from participante
                                where id_evento = e.id
                                and id_usuario = ${Prisma.sql`${idUsuarioCriador}`}
                            )
                        ) or (                            
                            e.limite_participantes > (
                                select 
                                    count(id)
                                from participante
                                where id_evento = e.id
                            )
                        )
                    )          
                    ${parametros.idCategoria ? Prisma.sql`and e.id_categoria = ${parametros.idCategoria}` : Prisma.sql``}          
                    ${parametros.dataFiltro ? Prisma.sql`and date(e.data_hora_inicio) = ${parametros.dataFiltro}` : Prisma.sql``}
                    ${parametros.horaFiltro ? Prisma.sql`and time(e.data_hora_inicio) = time(${parametros.horaFiltro})` : Prisma.sql``}          
                ${parametros.ordenacao ? 
                    Prisma.raw(`order by participando desc, e.data_hora_inicio ${parametros.ordenacao}`) : 
                    Prisma.sql`order by participando desc, e.data_hora_inicio desc`
                }
                limit ${registrosPorPagina} 
                offset ${skip}
            `);
            
            const totalRegistros: {total: string}[] = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    count(e.id) as total
                from evento e
                where 
                    e.id_usuario_criador != ${idUsuarioCriador}
                    and ADDTIME(e.data_hora_inicio, e.duracao) >= NOW()
                    and (
                        (
                            exists(
                                select
                                    id
                                from participante
                                where id_evento = e.id
                                and id_usuario = ${Prisma.sql`${idUsuarioCriador}`}
                            )
                        ) or (                            
                            e.limite_participantes > (
                                select 
                                    count(id)
                                from participante
                                where id_evento = e.id
                            )
                        )
                    )                   
                    ${parametros.idCategoria ? Prisma.sql`and e.id_categoria = ${parametros.idCategoria}` : Prisma.sql``}          
                    ${parametros.dataFiltro ? Prisma.sql`and date(e.data_hora_inicio) = ${parametros.dataFiltro}` : Prisma.sql``}
                    ${parametros.horaFiltro ? Prisma.sql`and time(e.data_hora_inicio) = time(${parametros.horaFiltro})` : Prisma.sql``}  
            `);
            
            // Camelizar os resultados
            const resultadosEventosCamelizados = eventosComDuracao.map(toCamelCase);
            
            return {
                eventos: resultadosEventosCamelizados as Prisma.EventoGetPayload<Prisma.EventoFindManyArgs>[],
                totalRegistros: Number(totalRegistros[0].total)
            };

        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }        
    },
    async consultaEventosMapa(idUsuarioDesconsiderar: string) {
        try {

            const idUsuario = parseInt(idUsuarioDesconsiderar);
                        
            const eventosMapa: Prisma.EventoGetPayload<Prisma.EventoFindManyArgs>[] = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    e.*,
                    if(
                        exists(
                        
                            select
                                id
                            from participante
                            where id_evento = e.id
                            and id_usuario = ${Prisma.sql`${idUsuario}`}
                                
                        ), "S", "N"
                    ) as participando
                from evento e
                where 
                    e.id_usuario_criador != ${idUsuario}
                    and ADDTIME(e.data_hora_inicio, e.duracao) >= NOW()
                    and e.latitude is not null
                    and e.longitude is not null
                    and (
                        (
                            exists(
                                select
                                    id
                                from participante
                                where id_evento = e.id
                                and id_usuario = ${Prisma.sql`${idUsuario}`}
                            )
                        ) or (                            
                            e.limite_participantes > (
                                select 
                                    count(id)
                                from participante
                                where id_evento = e.id
                            )
                        )
                    )                    
                group by e.id
                order by participando desc, e.data_hora_inicio asc
            `);
            
            const totalRegistros: {total: string}[] = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    count(e.id) as total
                from evento e
                where 
                    e.id_usuario_criador != ${idUsuario}
                    and ADDTIME(e.data_hora_inicio, e.duracao) >= NOW()
                    and e.latitude is not null
                    and e.longitude is not null
                    and (
                        (
                            exists(
                                select
                                    id
                                from participante
                                where id_evento = e.id
                                and id_usuario = ${Prisma.sql`${idUsuario}`}
                            )
                        ) or (                            
                            e.limite_participantes > (
                                select 
                                    count(id)
                                from participante
                                where id_evento = e.id
                            )
                        )
                    )                    
            `);
            
            // Camelizar os resultados
            const resultadosEventosCamelizados = eventosMapa.map(toCamelCase);
            
            return {
                eventos: resultadosEventosCamelizados as Prisma.EventoGetPayload<Prisma.EventoFindManyArgs>[],
                totalRegistros: Number(totalRegistros[0].total)
            };

        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }        
    },
    async consultarEventosUsuario(parametros: BodyEventoConsulta & { idUsuario: string }) {
        try {            
            
            const pagina = parseInt(parametros.pagina);
            const registrosPorPagina = parseInt(parametros.registrosPorPagina);
            const skip = (pagina - 1) * registrosPorPagina; 
            const idUsuarioCriador = parseInt(parametros.idUsuario);         

            const eventos: any = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    e.*
                from evento e
                where 
                    e.id_usuario_criador = ${idUsuarioCriador}      
                    ${parametros.idCategoria ? Prisma.sql`and e.id_categoria = ${parametros.idCategoria}` : Prisma.sql``}          
                    ${parametros.dataFiltro ? Prisma.sql`and date(e.data_hora_inicio) = ${parametros.dataFiltro}` : Prisma.sql``}
                    ${parametros.horaFiltro ? Prisma.sql`and time(e.data_hora_inicio) = time(${parametros.horaFiltro})` : Prisma.sql``}
                group by e.id
                ${parametros.ordenacao ? 
                    Prisma.raw(`order by e.data_hora_inicio ${parametros.ordenacao}`) : 
                    Prisma.sql`order by e.data_hora_inicio desc`
                }
                limit ${registrosPorPagina} 
                offset ${skip}
            `);

            const totalRegistros: {total: string}[] = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    count(e.id) as total
                from evento e
                where 
                    e.id_usuario_criador = ${idUsuarioCriador}      
                    ${parametros.idCategoria ? Prisma.sql`and e.id_categoria = ${parametros.idCategoria}` : Prisma.sql``}          
                    ${parametros.dataFiltro ? Prisma.sql`and date(e.data_hora_inicio) = ${parametros.dataFiltro}` : Prisma.sql``}
                    ${parametros.horaFiltro ? Prisma.sql`and time(e.data_hora_inicio) = time(${parametros.horaFiltro})` : Prisma.sql``}
            `);
            
            // Camelizar os resultados
            const resultadosEventosCamelizados: Prisma.EventoGetPayload<Prisma.EventoFindManyArgs>[] = eventos.map(toCamelCase);
            
            return {
                eventos: resultadosEventosCamelizados,
                totalRegistros: Number(totalRegistros[0]?.total) ?? 0
            };

        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async consultarId(idEvento: string) {
        try {
            const id = Number(idEvento);
            const evento = await prisma.evento.findUnique({ 
                where: { 
                    id 
                } 
            });
            return evento;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async deletar(id: number) {
        try {
            const eventoDeletado = await prisma.evento.delete({
                where: {
                    id
                }
            });
            return eventoDeletado;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    }
}