import { ICategoria } from "./ICategoria";

export interface IEvento {
    id: number;
    idUsuarioCriador: number;
    idCategoria: number;
    nome: string;
    descricao: string;
    dataHoraInicio: string;
    local: string;
    duracao: string;
    valorEntrada: null | number;
    limiteParticipantes: number;
    latitude: number;
    longitude: number;
    dataCadastro: string;
    ativo: string;
}

export interface IEventoRetorno {    
    eventos: Array<IEvento & {
        categoria: ICategoria,
        totalParticipantes: number;
        encerrado: boolean;
        participando?: string;
    }>;
    categorias: ICategoria[];
    totalPaginas: number;
    totalRegistros: number;
}