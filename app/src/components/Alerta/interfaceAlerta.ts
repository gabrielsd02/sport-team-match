export interface IAlerta {
    mensagem: string;
    titulo: string;
    fechar: () => void;
    corMensagem?: string;
    tamanhoTitulo?: string;
    tamanhoMensagem?: string;
    botaoConfirmar: () => void;
    textoCancelar?: string;
    textoConfirmar?: string;
}