import { StackNavigationProp } from "@react-navigation/stack";
import { Route } from "@react-navigation/native";

import { IRotas } from "../../routes/interfaceRotas";
import { IEvento } from "../../interfaces/IEvento";

export type ListaParticipantesProp = {
    navigation: StackNavigationProp<IRotas, 'ListaParticipantesEvento'>;
    route: Route<'ListaParticipantesEvento', {
        idEvento: number;
    }>
}

export interface ParticipantesEventoResponse {
    participantes: {
        id: number;
        idUsuario: number;
        idEvento: number;
        dataNascimento: string; 
        foto: string | null; 
        telefone: string | null;
        nome: string; 
        distancia: number;
        nota: string | null; 
        sexo: string;
    }[];
    dadosEvento: IEvento;
    totalPaginas: number;
    totalRegistros: number;
}