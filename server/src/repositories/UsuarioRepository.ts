import { Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import bcrypt from 'bcrypt';

import { 
    IUsuario, 
    ILogin, 
    BodyUsuarioConsulta, 
    IUsuarioDistancia 
} from "../interfaces/Usuario";
import { prisma } from "../database";
import { DatabaseError } from "../exceptions";
import { toCamelCase } from "../functions";
import { IEventoBanco } from "../interfaces/Evento";

const SALT = 10

export default {
    async consultar(parametros: BodyUsuarioConsulta, dadosEvento: IEventoBanco) {
        
        try {   

            const usuarios: any[] = await prisma.$queryRaw`
                SELECT
                    u.*,
                    round(
                        (
                            6371000 * acos(
                                cos(radians(u.latitude)) * 
                                cos(radians(${Prisma.sql`${dadosEvento.latitude}`})) * 
                                cos(radians(${Prisma.sql`${dadosEvento.longitude}`}) - 
                                radians(u.longitude)) +
                                sin(radians(u.latitude)) * 
                                sin(radians(${Prisma.sql`${dadosEvento.latitude}`}))
                            )
                        )
                    , 0) AS distancia
                from usuario u
                where u.ativo = "S"
                and u.latitude is not null
                and u.longitude is not null
                and not exists (
                    select 
                        id
                    from convite
                    where id_evento = ${Prisma.sql`${parametros.idEvento}`}
                    and id_usuario_destinatario = u.id
                )
                and not exists (
                    select 
                        id
                    from participante
                    where id_evento = ${Prisma.sql`${parametros.idEvento}`}
                    and id_usuario = u.id
                )
                ${Prisma.sql`AND u.id != ${dadosEvento.idUsuarioCriador}`}
                group by u.id
                order by distancia asc
                ${parametros.pagina && parametros.registrosPorPagina ? 
                    Prisma.sql`
                        LIMIT ${parametros.registrosPorPagina}
                        OFFSET ${(parseInt(parametros.pagina) - 1) * parseInt(parametros.registrosPorPagina)}
                    ` : 
                    Prisma.sql``
                }
            `;
            
            const totalRegistros: number = await prisma.usuario
                .count({
                    where: {
                        id: {
                            notIn: [dadosEvento.idUsuarioCriador]
                        },
                        ativo: "S",
                        latitude: {
                            not: null
                        },
                        longitude: {
                            not: null
                        }
                    }
                })
            ;
            
            // cameliza os resultados
            const usuariosCamelizados: IUsuarioDistancia[] = usuarios.map(toCamelCase);
            
            return {
                usuarios: usuariosCamelizados,
                totalRegistros
            };
            
        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 
    },
    async consultarId(idUsuario: string) {
        try {
            const id = Number(idUsuario);
            const usuario = await prisma.usuario.findUnique({ where: { id } });
            return usuario;
        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 
    },
    async consultarEmail(email: string) {
        try {
            const usuario = await prisma.usuario.findUnique({ where: { email } });
            return usuario;
        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 
    },
    async criar(dados: IUsuario) {
        try {

            const dataNascimento = DateTime.fromJSDate(new Date(dados.dataNascimento)).set({ hour: 18 }).toISO() ?? dados.dataNascimento;

            // criptografa senha
            const hashSenha = await bcrypt.hash(dados.senha, SALT);
            const usuario = await prisma.usuario.
                create({ 
                    data: {
                        ...dados,
                        senha: hashSenha,
                        dataNascimento
                    } 
                })
            ;
            return usuario;
            
        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 
    },
    async login(dados: ILogin) {
        try {
            const usuario = await prisma.usuario.findUnique({ 
                where: { 
                    email: dados.email,
                    senha: dados.senha
                } 
            });
            return usuario;
        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 
    },
    async salvar(idUsuario: string, dados: IUsuario) {
        const dataNascimento = DateTime.fromJSDate(new Date(dados.dataNascimento)).set({ hour: 18 }).toISO() ?? dados.dataNascimento;
        try {
            const usuarioEditado = await prisma.usuario.update({
                where: {
                    id: Number(idUsuario)
                },
                data: {
                    nome: dados.nome,
                    email: dados.email,
                    foto: dados.foto,
                    telefone: dados.telefone,
                    sexo: dados.sexo,
                    latitude: dados.latitude,
                    longitude: dados.longitude,
                    codigoRecuperacao: dados.codigoRecuperacao,
                    dataNascimento
                }
            });
            return usuarioEditado;
        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 
    },
    async atualizarSenha(id: number, senha: string) {
        try {

            // criptografa senha
            const hashSenha = await bcrypt.hash(senha, SALT);
            const usuario = await prisma.usuario.
                update({ 
                    where: {
                        id
                    },
                    data: {
                        senha: hashSenha,
                        codigoRecuperacao: null
                    } 
                })
            ;
            return usuario;

        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 
    },
    async verificarCodigo(id: number, codigo: string) {
        try {
            const usuarioCodigo = await prisma.usuario.findUnique({
                where: {
                    id,
                    codigoRecuperacao: codigo
                }                
            });
            return usuarioCodigo;
        } catch(e) {
            console.log(e)
            throw new DatabaseError("Houve um erro ao comunicar com o banco");
        } 

    }
}