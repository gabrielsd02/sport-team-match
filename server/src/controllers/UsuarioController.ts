import { 
    Request, 
    Response 
} from "express";
import Aws from "../aws/Aws";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

import { 
    BodyUsuarioConsulta,
    ILogin, 
    IUsuario 
} from "../interfaces/Usuario";
import { 
    gerarJwt, 
    retornarErro, 
    tratarCatch 
} from "../functions";
import { 
    handleErrosUsuarioSalvar, 
    validarSenha 
} from "../handlers/UsuarioHandler";
import UsuarioRepository from "../repositories/UsuarioRepository";
import AvaliacoesUsuariosRepository from "../repositories/AvaliacoesUsuariosRepository";
import EventoRepository from "../repositories/EventoRepository";
import { DateTime } from "luxon";

// verifica foto para deletar
async function verificaFoto(fotoBanco: string) {

    // se possuir foto no banco e ela for da aws
    if(fotoBanco && fotoBanco.includes(process.env.LINK_AWS as string)) {

        // divide a string para adquirir o codigo do arquivo
        let partesLink = fotoBanco.split('com/');

        // resgata o codigo
        let codigoArquivo = partesLink[1];
        
        // remove arquivo da aws
        await Aws.remover(codigoArquivo);

    }

}

async function enviarEmail(nome: string, email: string, codigo: string) {

    // resgta o codigo
    const codigoEmail = `${codigo}`;
    
    try {
    
        // configura credenciais com stmp
        const transporter = nodemailer.createTransport({
            host: process.env.SERVICO_EMAIL,
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
        });

        // envia email com as devidas configurações
        await transporter.sendMail({
            from: 'xgabrields@gmail.com',
            to: email,
            subject: "Confirmação de alteração de dados na sua conta",
            html: `
                <b>Olá ${nome}!</b><br/>
                <p>Identificamos um pedido para alteração de senha para sua conta no SporTeaMatch, caso você não tenha feito a solicitação, sua senha não será alterada 😁<p/><br/>
                <p>Segue o código para a continuação do procedimento de redefinição da sua senha: ${codigoEmail}</p>
            `
        });

        // retorna seus dados
        return true;

    } catch(e) {
        console.error(e);
    }

}

export default {
    async criar(req: Request, res: Response) {
        
        // resgata dados do usuário
        const dadosUsuario = req.body as IUsuario;
        
        // lida com erros de criação
        const erro = await handleErrosUsuarioSalvar(dadosUsuario, true) ?? null;
        if(erro) return retornarErro({ mensagem: erro, res });  
        
        // consulta usuário no banco
        const existeUsuario = await UsuarioRepository
            .consultarEmail(dadosUsuario.email)
        ;

        // caso exista, retona erro
        if(existeUsuario) return retornarErro({ 
            mensagem: "Este e-mail já está sendo utilizado", 
            res 
        });

        // se enviou foto
        if(dadosUsuario.foto && dadosUsuario.foto !== '') {

            // adiciona na aws e resgata o link
            dadosUsuario.foto = await Aws.adicionar(dadosUsuario.foto);

        }

        try {                        

            // cria novo usuário
            const novoUsuario = await UsuarioRepository.criar(dadosUsuario);

            // gera token
            const token = gerarJwt(novoUsuario);
            const { senha, ...rest } = novoUsuario;

            // retorna seus dados
            return res
                .status(200)
                .json({ 
                    ...rest,
                    token
                })
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    },
    async login(req: Request, res: Response) {

        // resgata dados do usuário
        const dadosUsuario = req.body as ILogin;

        // consulta usuário no banco
        const usuarioEmail = await UsuarioRepository
            .consultarEmail(dadosUsuario.email)
        ;

        // caso exista, retona erro
        if(!usuarioEmail) return retornarErro({ 
            mensagem: "Usuário não encontrado", 
            res 
        });

        // compara senhas
        const senhaValida = await bcrypt
            .compare(dadosUsuario.senha, usuarioEmail.senha)
        ;
        
        // retorna erro, caso senhas são invalidas
        if(!senhaValida) return retornarErro({ 
            mensagem: "Senha inválida", 
            res 
        });

        try {

            // consultou usuário
            const usuario = await UsuarioRepository.login({
                email: usuarioEmail.email,
                senha: usuarioEmail.senha
            });

            // caso o usuário não foi encontrado (só para garantir)
            if(!usuario) return retornarErro({ 
                mensagem: "Usuário não encontrado", 
                res 
            });

            // gera token
            const token = gerarJwt(usuario);
            const { senha, ...rest } = usuario;

            // retorna seus dados
            return res
                .status(200)
                .json({ 
                    ...rest,
                    token
                })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async loginEmail(req: Request, res: Response) {

        const emailUsuario = req.params.email ?? null;
        
        // consulta usuário no banco
        const usuarioEmail = await UsuarioRepository
            .consultarEmail(emailUsuario)
        ;

        // caso exista, retona erro
        if(!usuarioEmail) return retornarErro({ 
            mensagem: "O e-mail inserido não foi encontrado no sistema", 
            res 
        });

        try {

            // consultou usuário
            const usuario = await UsuarioRepository.login({
                email: usuarioEmail.email,
                senha: usuarioEmail.senha
            });

            // caso o usuário não foi encontrado (só para garantir)
            if(!usuario) return retornarErro({ 
                mensagem: "Usuário não encontrado", 
                res 
            });

            // gera token
            const token = gerarJwt(usuario);
            const { senha, ...rest } = usuario;

            // retorna seus dados
            return res
                .status(200)
                .json({ 
                    ...rest,
                    token
                })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async consultar(req: Request, res: Response) {

        const parametrosQuery: any = req.query;
        const parametros = parametrosQuery as BodyUsuarioConsulta;

        const dadosEvento = await EventoRepository.consultarId(parametros.idEvento.toString());

        if(!dadosEvento) return retornarErro({ mensagem: 'Evento não encontrado', res });  

        try {


            const { usuarios, totalRegistros } = await UsuarioRepository.consultar(
                parametros,
                dadosEvento
            );

            let usuariosRetorno: any[] = [];
            const totalPaginas = Math.ceil(totalRegistros / parseInt(parametros.registrosPorPagina));

            // percorre participantes do evento
            for (let index = 0; index < usuarios.length; index++) {

                const usuario = usuarios[index];                  
                
                // resgata média da nota do usuario
                const avaliacaoUsuario = await AvaliacoesUsuariosRepository.consultarIdUsuarioAvaliado(usuario.id);
                
                // adiciona informações específicas ao array
                usuariosRetorno = usuariosRetorno.concat({
                    id: usuario.id,
                    nome: usuario?.nome,
                    distancia: usuario.distancia,
                    sexo: usuario?.sexo,
                    dataNascimento: usuario?.dataNascimento,
                    foto: usuario?.foto,
                    nota: (avaliacaoUsuario?._avg ? avaliacaoUsuario._avg.nota : null)
                });
                
            }

            // retorna seus dados
            return res
                .status(200)
                .json({
                    usuarios: usuariosRetorno,
                    dadosEvento,
                    totalRegistros,
                    totalPaginas
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
            mensagem: "ID do usuário é obrigatório", 
            res 
        });

        try {

            // consultou usuário
            const usuario = await UsuarioRepository.consultarId(id);

            // caso o usuário não foi encontrado (só para garantir)
            if(!usuario) return retornarErro({ 
                mensagem: "Usuário não encontrado", 
                res 
            });

            // gera token
            const { senha, ...rest } = usuario;

            // retorna seus dados
            return res
                .status(200)
                .json({ ...rest })
            ;

        } catch(error) {
            tratarCatch(error, res);
        }

    },
    async atualizar(req: Request, res: Response) {
        
        // resgata dados do usuário
        const idUsuario = req.params.id as string;
        const dadosUsuario = req.body as IUsuario & { naoVerificar?: boolean };
        
        // lida com erros
        const erro = dadosUsuario.naoVerificar ? null : await handleErrosUsuarioSalvar(dadosUsuario, false) ?? null;
        if(erro) return retornarErro({ mensagem: erro, res }); 

        // consultou usuário
        const usuarioBanco = await UsuarioRepository.consultarId(idUsuario);

        // se alterou a foto
        if(dadosUsuario.foto && (dadosUsuario.foto !== usuarioBanco?.foto)) {
            
            // verifica foto do banco para ver se exclui
            if(usuarioBanco && usuarioBanco.foto) await verificaFoto(usuarioBanco.foto);

            // adiciona na aws e resgata o link
            dadosUsuario.foto = await Aws.adicionar(dadosUsuario.foto);

        }

        try {                        

            // atualiza dados do usuário
            const usuarioEditado = await UsuarioRepository.salvar(idUsuario, dadosUsuario);
            const { senha, ...rest } = usuarioEditado;

            // retorna seus dados
            return res
                .status(200)
                .json({  ...rest })
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    },
    async verificarEmail(req: Request, res: Response) {

        try {

            const email = req.body.email as string;
            
            // consulta usuário no banco
            const usuarioEmail = await UsuarioRepository.consultarEmail(email);
            
            // caso exista, retona erro
            if(!usuarioEmail) return retornarErro({ 
                mensagem: "O e-mail inserido não foi encontrado no sistema", 
                res 
            });
            
            // gera codigo aleatorio
            const codigo = (Math.random() + 1).toString(36).substring(5);

            // realiza o envio de email ao usuario
            await enviarEmail(usuarioEmail.nome, usuarioEmail.email, codigo);

            // adiciona codigo no banco
            await UsuarioRepository.salvar(
                usuarioEmail.id.toString(), 
                {
                    ...usuarioEmail,
                    codigoRecuperacao: codigo
                }
            );
            
            // resgata dados do usuario
            const { senha, ...rest } = usuarioEmail;

            // retorna seus dados
            return res
                .status(200)
                .json({  ...rest })
            ;

        } catch(error) {                    
            tratarCatch(error, res);
        }

    },
    async atualizarSenha(req: Request, res: Response) {

        const id = parseInt(req.params.id);
        const senha = req.body.senha as string;

        // lida com erro de senha
        const erro = validarSenha(senha) ?? null;
        if(erro) return retornarErro({ mensagem: erro, res });  

        try {                        

            // atualiza senha do usuário
            await UsuarioRepository.atualizarSenha(id, senha);

            // retorna seus dados
            return res.status(200).json();

        } catch(error) {                    
            tratarCatch(error, res);
        }

    },
    async verificarCodigo(req: Request, res: Response) {

        const id = parseInt(req.params.id);
        const codigo = req.body.codigo as string;

        try {                        

            // atualiza senha do usuário
            const usuario = await UsuarioRepository.verificarCodigo(id, codigo);

            // verifica se encontrou usuário
            if(!usuario) {

                // caso não encontrou, retona erro
                return retornarErro({ 
                    mensagem: "Código inserido não encontrado", 
                    res 
                });

            }

            // retorna seus dados
            return res.status(200).json();

        } catch(error) {                    
            tratarCatch(error, res);
        }

    }
}
