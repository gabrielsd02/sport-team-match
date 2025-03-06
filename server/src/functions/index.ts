import { Response } from "express";
import { addHours, addMinutes } from 'date-fns';
import jsonwebtoken from 'jsonwebtoken';

import { IRetornarErro } from "./interfaceFunctions";
import { IUsuario } from "../interfaces/Usuario";
import { DatabaseError } from "../exceptions";

export function isVazio(str: string | null) {
    return (!str || str.length === 0);
}

export function tratarCatch(error: Error | unknown, res: Response) {
    
    // se for do tipo error
    if (error instanceof Error) {
        
        // retorna erro com mensagem
        return res
            .status(400)
            .json({
                message: error.message,
                error: true,
                banco: error instanceof DatabaseError ? true : false
            })
        ;

    } else {

        // Tratamento de outros tipos de erros
        console.error(error);
        return res.json({
            message: "Erro desconhecido",
            error: true
        });
    }

}

export function retornarErro({
    mensagem,
    status=400,
    res
}: IRetornarErro) {
    return res
        .status(status)
        .json({ 
            message: mensagem, 
            error: true 
        })
    ;
}

export function adicionarHoraMinutoData(data: Date, hora: number, minuto?: number) {
    let dataAdicionada = addHours(data, hora);
    if(minuto) dataAdicionada = addMinutes(dataAdicionada, minuto);
    return dataAdicionada;
}

export function gerarJwt(usuario: IUsuario) {
    const usuarioObjeto = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        dataNascimento: usuario.dataNascimento,
        telefone: usuario.telefone,
        sexo: usuario.sexo,
        dataCadastro: usuario.dataCadastro
    }
    const token = jsonwebtoken.sign(usuarioObjeto, process.env.CHAVE_JWT as string);
    return `Bearer ${token}`;
}

export function toCamelCase(obj: any) {
    const camelCaseObj = {} as any;
    for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        camelCaseObj[camelCaseKey] = obj[key];
    }
    }
    return camelCaseObj;
}