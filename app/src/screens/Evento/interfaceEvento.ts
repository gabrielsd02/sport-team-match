import { StackNavigationProp } from "@react-navigation/stack";
import { Route } from "@react-navigation/native";

import { ICategoria } from "../../interfaces/ICategoria";
import { IEventoRetorno } from "../../interfaces/IEvento";
import { IRotas } from "../../routes/interfaceRotas";
import { IUsuario } from "../../interfaces/IUsuario";
import { IConvite } from "../../interfaces/IConvite";

export type EventoProp = {
    navigation: StackNavigationProp<IRotas, 'Evento'>;
    route: Route<"Evento", {
        id?: number;
        aceitarConvite?: () => void;
        contagemParticipante?: number;
    }>
}

export interface IEventoConsulta {
    evento: IEventoRetorno['eventos'][0];
    usuarioCriador: IUsuario;
    idsUsuariosParticipantes: number[];
    totalParticipantes: number;
    convitesEvento: IConvite[];
    participantes: {
        nome: string;
        sexo: string;
        dataNascimento: string;
        foto: string | null;
        nota: string | null;
    }[];
    categorias: ICategoria[];
}