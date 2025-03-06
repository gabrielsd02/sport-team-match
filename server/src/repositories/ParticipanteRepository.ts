import { Prisma } from "@prisma/client";

import { prisma } from "../database";
import { DatabaseError } from "../exceptions";
import { 
    IParticipante,
    IParticipanteCadastro,
    IParticipanteParams
} from "../interfaces/Participante";
import { toCamelCase } from "../functions";

export default {
    async cadastrar(dados: IParticipanteCadastro) {

        try {

            const participante = await prisma.participante.
                create({
                    data: dados
                });
            return participante;

        } catch(e: any) {
            console.error(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
        
    },
    async consultarParticipantes(parametros: IParticipanteParams) {

        try {
            
            const participantes: any[] = await prisma.$queryRaw`
                SELECT
                    p.*,
                    round(
                        (
                            6371000 * acos(
                                cos(radians(u.latitude)) * 
                                cos(radians(e.latitude)) * 
                                cos(radians(e.longitude) - 
                                radians(u.longitude)) +
                                sin(radians(u.latitude)) * 
                                sin(radians(e.latitude))
                            )
                        )
                    , 0) AS distancia
                from participante p
                join usuario u
                on p.id_usuario = u.id
                join evento e
                on p.id_evento = e.id
                where p.ativo = "S"
                ${parametros?.idEvento ? Prisma.sql` AND p.id_evento = ${parametros.idEvento} ` : Prisma.sql``}
                ${parametros?.ordenarDistancia ? Prisma.sql`order by distancia asc` : Prisma.sql`order by p.id asc`} 
                ${(parametros?.pagina && parametros?.registrosPorPagina) ? 
                    Prisma.sql`
                        LIMIT ${parametros.registrosPorPagina}
                        OFFSET ${(parseInt(parametros.pagina) - 1) * parseInt(parametros.registrosPorPagina)}
                    ` : 
                    Prisma.sql``
                }
            `;
            
            const totalRegistros: number = await prisma.participante
                .count({
                    where: {
                        ativo: "S",
                        idEvento: parametros?.idEvento
                    }
                })
            ;
            
            // cameliza os resultados
            const participantesCamelizados: IParticipante[] = participantes.map(toCamelCase);
            
            return {
                participantes: participantesCamelizados,
                totalRegistros
            };

        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }     

    },
    async consultarId(idParticipante: number) {
        const id = Number(idParticipante);
        const participante = await prisma.participante.findUnique({ where: { id } });
        return participante;
    },
    async consultarUsuarioEvento(idEvento: number, idUsuario: number) {
        try {
            const participante = await prisma.participante.
                findFirst({
                    where: {
                        idEvento,
                        idUsuario
                    }
                })
            ;
            return participante;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async deletar(id: number) {
        try {
            const participante = await prisma.participante.
                delete({
                    where: {
                        id
                    }
                })
            ;
            return participante;
        } catch(e) {
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    }
}