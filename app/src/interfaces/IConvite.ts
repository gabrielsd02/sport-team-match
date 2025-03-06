import { IUsuarioInfo } from "./IUsuario";

export interface IConvite {
    id: number;
    idEvento: number
    idUsuarioEmissor: number
    idUsuarioDestinatario: number
    descricao: string | null;
    tipo: string;
    dataCadastro: Date;
    ativo: string;
}

export type ConviteRetorno = IConvite & {
    usuarioEmissor: Omit<IUsuarioInfo, 'senha'> & {
        nota: number | null;
    }
};

export interface IConviteRetorno {
    convites: ConviteRetorno[];
    totalPaginas: number;
    totalRegistros: number;
}
