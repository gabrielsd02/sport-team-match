export interface IUsuario {
    id: number;
    nome: string;
    token: string;
    foto?: string;
}

export interface IUsuarioInfo {
    id: string;
    nome: string;
    email: string;
    sexo: string;
    dataNascimento: string;
    telefone: string | null;
    foto: string | null;
    dataCadastro: Date;
    ativo: string;
}