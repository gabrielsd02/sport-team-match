import * as emailValidator from 'deep-email-validator';
import { IUsuario } from '../interfaces/Usuario';
import { isVazio } from '../functions';

export async function handleErrosUsuarioSalvar(dados: IUsuario, verificarSenha: boolean) {
    if(isVazio(dados?.email)) return "E-mail é obrigatório";
    if(isVazio(dados?.senha) && verificarSenha) return "Senha é obrigatório";
    if(isVazio(dados?.nome))  return "Nome é obrigatório";
    if(isVazio((dados?.dataNascimento ?? '').toString())) return "Data de nascimento é obrigatório";
    if(!validarData(dados?.dataNascimento.toString())) return "Data de nascimento é inválida";
    if(!(await validarEmail(dados.email))) return "Endereço de e-mail inválido";
    return verificarSenha ? validarSenha(dados.senha) : null;
}

export async function validarEmail(email: string) {
    let valido = false;
    valido = (await emailValidator.validate({
        email,
        validateSMTP: false
    })).valid;
    return valido;   
}

export function validarData(dt: string) {
    let isValidDate = Date.parse(dt);
    return !isNaN(isValidDate);
}

export function validarSenha(senha: string) {
    let erro: string | null = null;
    if(senha.length < 6) erro = "O tamanho mínimo da senha é de 6 caractéres";
    const regex = /\d/;
    if(!regex.test(senha)) erro = "A senha deve conter caractéres numéricos";
    return erro;
}