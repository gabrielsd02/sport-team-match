import { StackNavigationProp } from "@react-navigation/stack";
import { Route } from "@react-navigation/native";

import { ICategoria } from "../../interfaces/ICategoria";
import { IEvento, IEventoRetorno } from "../../interfaces/IEvento";
import { IRotas } from "../../routes/interfaceRotas";
import { IUsuario } from "../../interfaces/IUsuario";

export type ConvitesProp = {
    navigation: StackNavigationProp<IRotas, 'Convites'>;
    route: Route<"Evento">
}

export interface ConviteConfirmaResponse {
    nomeParticipante: string;
    dadosEvento: IEvento;
}

// export interface IEventoConsulta {
//     evento: IEventoRetorno['eventos'][0];
//     usuarioCriador: IUsuario;
//     categorias: ICategoria[];
// }