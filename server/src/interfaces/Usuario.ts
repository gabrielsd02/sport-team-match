export interface IUsuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    dataNascimento: Date;
    foto: string | null;
    telefone: string | null;
    sexo: string | null;
    dataCadastro: Date;
    latitude: number | null;
    longitude: number | null;
    ativo: string;
    codigoRecuperacao: string | null;
}

export interface ILogin {
    email: string;
    senha: string;
}

export interface BodyUsuarioConsulta {
    idEvento: string;
    pagina: string;
    registrosPorPagina: string;
}

export type IUsuarioDistancia = IUsuario & {
    distancia: number;
}