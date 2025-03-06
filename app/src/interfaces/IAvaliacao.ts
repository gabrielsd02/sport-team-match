export interface IAvaliacoesUsuarios {
    ativo: string;
    comentario: string | null; 
    dataCadastro: string;
    id: number;
    idUsuarioAlvo: number;
    idUsuarioAvaliador: number;
    nota: number;
}