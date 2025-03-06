import { ListaUsuariosResponse } from "../../screens/ListaUsuarios/interfaceListaUsuarios";

export interface IModalParticipanteProps {
    fechar: () => void;
    criadorEvento?: boolean;
    textoTamanho: any;
    idUsuario: string;
    idUsuarioCriador?: number;
    participante?: boolean;
    dadosUsuario: Omit<ListaUsuariosResponse['usuarios'][0], "distancia"> & {
        distancia?: number
    };
}