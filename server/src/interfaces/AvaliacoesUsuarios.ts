export interface IAvaliacaoUsuarios {
    id?: number;
    idUsuarioAlvo: number;
    idUsuarioAvaliador: number;
    comentario: string | null;
    nota: number;
    dataCadastro: Date;
    ativo: string;
}

export interface IConsultarParams {
    idUsuarioAlvo: string;
    idUsuarioAvaliador: string;
}