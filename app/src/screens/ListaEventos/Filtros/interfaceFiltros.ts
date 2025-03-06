import { ICategoria } from "../../../interfaces/ICategoria";
import { IFiltrosEventos } from "../interfaceListaEventos";

export interface IFiltrosProps {
    fechar: () => void;
    textoTamanho: any;
    categorias: ICategoria[];
    filtros: IFiltrosEventos;
    alterarFiltros: (valor: IFiltrosEventos) => void;
}

export interface IOrdenacao {
    nome: string;
    valor: string;
}