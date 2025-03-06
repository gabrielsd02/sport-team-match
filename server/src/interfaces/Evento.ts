export interface IEvento {
    id: number;
    idUsuarioCriador: number;
    idCategoria: number;
    nome: string;
    descricao: string;
    dataHoraInicio: Date;
    local: string;
    duracao: string;
    valorEntrada: number | null;
    limiteParticipantes: number;
    latitude: number;
    longitude: number;
    dataCadastro: Date;
    ativo: string;
}

export type IEventoBanco = Omit<IEvento, 'duracao'> & {
    duracao: Date;
}

export interface BodyEventoConsulta {
    pagina: string;
    registrosPorPagina: string;
    idUsuarioCriador?: number;
    idCategoria?: number;
    dataFiltro?: string;
    horaFiltro?: string;
    ordenacao?: string;
}