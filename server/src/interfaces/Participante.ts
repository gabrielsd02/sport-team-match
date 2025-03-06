export interface IParticipante {
    id: number;
    idUsuario: number;
    idEvento: number;
    dataCadastro: string;
    ativo: string;
}

export interface IParticipanteCadastro {
    id?: number;
    idUsuario: number;
    idEvento: number;
}

export interface IParticipanteParams {
    pagina?: string;
    registrosPorPagina?: string;
    idEvento?: number;
    ordenarDistancia?: boolean;
}

export interface BodyParticipanteConsulta {
    pagina: string;
    registrosPorPagina: string;
}