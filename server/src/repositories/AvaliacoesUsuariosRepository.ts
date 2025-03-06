import { prisma } from "../database";
import { DatabaseError } from "../exceptions";
import { 
    IAvaliacaoUsuarios, 
    IConsultarParams 
} from "../interfaces/AvaliacoesUsuarios";

export default {
    async consultar(parametros: IConsultarParams) {
        try {

            const avaliacao = await prisma.avaliacoesUsuarios.
                findFirst({
                    where: {
                        ativo: "S",
                        idUsuarioAlvo: parseInt(parametros.idUsuarioAlvo),
                        idUsuarioAvaliador: parseInt(parametros.idUsuarioAvaliador)
                    }
                })
            ;
            return avaliacao;
        } catch(e: any) {
            console.error(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async consultarIdUsuarioAvaliado(id: number) {
        try {

            const avaliacao = await prisma.avaliacoesUsuarios.
                aggregate({
                    _avg: {
                        nota: true
                    },
                    where: {
                        idUsuarioAlvo: id
                    }
                })
            ;
            return avaliacao;
        } catch(e: any) {
            console.error(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }
    },
    async cadastrar(dados: IAvaliacaoUsuarios) {

        try {

            const avaliacao = await prisma.avaliacoesUsuarios.
                create({
                    data: {
                        idUsuarioAlvo: parseInt(dados.idUsuarioAlvo+''),
                        idUsuarioAvaliador: parseInt(dados.idUsuarioAvaliador+''),
                        nota: dados.nota,
                        comentario: dados.comentario
                    }
                })
            ;
            return avaliacao;
        } catch(e: any) {
            console.error(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }

    },
    async atualizar(dados: IAvaliacaoUsuarios) {

        try {

            const avaliacao = await prisma.avaliacoesUsuarios.
                update({
                    data: {                        
                        idUsuarioAlvo: dados.idUsuarioAlvo,
                        idUsuarioAvaliador: parseInt(dados.idUsuarioAvaliador+''),
                        nota: dados.nota,
                        comentario: dados?.comentario
                    },
                    where: {
                        id: dados.id!
                    }
                })
            ;
            return avaliacao;
        } catch(e: any) {
            console.error(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        }

    }
}