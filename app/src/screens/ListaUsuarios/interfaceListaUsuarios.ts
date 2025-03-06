import { StackNavigationProp } from "@react-navigation/stack";
import { Route } from "@react-navigation/native";

import { IRotas } from "../../routes/interfaceRotas";
import { IEvento } from "../../interfaces/IEvento";

export type ListaUsuariosProp = {
    navigation: StackNavigationProp<IRotas, 'ListaUsuarios'>;
    route: Route<'ListaUsuarios', {
        idEvento: number;
    }>
}

export interface ListaUsuariosResponse {
    usuarios: {
        id: number;
        nome: string;
        distancia: number;
        sexo: string | null;
        telefone: string | null;
        dataNascimento: string;
        foto: string | null;
        nota: number | null;
    }[];
    dadosEvento: IEvento;
    totalRegistros: number;
    totalPaginas: number;
}