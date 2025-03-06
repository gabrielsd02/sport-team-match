import { Response } from "express";

export interface IRetornarErro {
    mensagem: string;
    res: Response;
    status?: number;
}