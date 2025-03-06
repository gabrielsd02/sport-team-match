export interface IConvite {
    id?: number
    idEvento: number
    idUsuarioEmissor: number
    idUsuarioDestinatario: number
    descricao?: string | null
    tipo: string;
    dataCadastro?: Date | string
    ativo?: string
}

export interface IConviteParametros {
    idEvento: number
    idUsuarioEmissor: number;
    idUsuarioDestinatario: number;
    pagina: string;
    registrosPorPagina: string;
}