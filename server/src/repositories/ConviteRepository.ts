import { Prisma } from "@prisma/client";
import { prisma } from "../database";
import { DatabaseError } from "../exceptions";
import { IConvite, IConviteParametros } from "../interfaces/Convite";
import { toCamelCase } from "../functions";

export default {
    async cadastrar(dados: IConvite) {
        try {
            const convite = await prisma.convite.
                create({ 
                    data: dados
                })
            ;
            return convite;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async atualizar(id: number, dados: IConvite) {
        try {
            const convite = await prisma.convite.
                update({
                    data: dados,
                    where: {
                        id
                    }
                })    
            ;
            return convite;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async consultar(parametros: IConviteParametros) {
        
        try {

            const pagina = parseInt(parametros.pagina);
            const registrosPorPagina = parseInt(parametros.registrosPorPagina);
            const skip = (pagina - 1) * registrosPorPagina; 

            const convites: Prisma.ConviteGetPayload<Prisma.ConviteFindManyArgs>[] = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    distinct c.*
                from convite c
                join evento e
                where 
                    c.ativo = "S"
                    and c.id_usuario_destinatario = ${parametros.idUsuarioDestinatario}
                    and ADDTIME(e.data_hora_inicio, e.duracao) >= NOW()
                order by c.data_cadastro desc
                limit ${registrosPorPagina} 
                offset ${skip}
            `);

            const totalRegistros: {total: string}[] = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    COUNT(c.id) as total
                from convite c
                join evento e
                where 
                    c.ativo = "S"
                    and c.id_usuario_destinatario = ${parametros.idUsuarioDestinatario}
                    and ADDTIME(e.data_hora_inicio, e.duracao) >= NOW()
            `);
            
            // cameliza os resultados
            const resultadosConviteCamelizados: IConvite[] = convites.map(toCamelCase);

            return {
                convites: resultadosConviteCamelizados,
                totalRegistros: Number(totalRegistros[0].total)
            }

        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 

    },
    async consultarConvitesEvento(idEvento: number) {
        try {
            const convites = await prisma.convite.
                findMany({
                    where: {
                        idEvento
                    }
                })    
            ;
            return convites;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async consultarId(id: number) {
        try {
            const convite = await prisma.convite.
                findUnique({
                    where: {
                        id
                    }
                })    
            ;
            return convite;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async deletar(id: number) {
        try {
            const convite = await prisma.convite.
                delete({
                    where: {
                        id
                    }
                })
            ;
            return convite;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async consultarQuantidade(idUsuario: string) {
        try {
            const totalConvites = await prisma.convite.
                count({
                    where: {
                        idUsuarioDestinatario: parseInt(idUsuario)
                    }
                })    
            ;
            return totalConvites;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    }
}