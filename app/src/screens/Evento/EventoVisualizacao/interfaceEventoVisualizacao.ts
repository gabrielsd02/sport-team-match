import { ICategoria } from "../../../interfaces/ICategoria";
import { IUsuario } from "../../../interfaces/IUsuario";

export interface EventoVisualizacaoProps {
    textoTamanho: any;
    usuarioCriador: IUsuario;
    categoriaSelecionada: ICategoria;
    cores: any;
    titulo: string;
    descricao: string;
    data: string;
    hora: string;
    localEvento: string;
    duracao: string;
    valorEntrada: string | null;
    limiteParticipantes: string;
    totalParticipantes: number;
}