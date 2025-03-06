import { StackNavigationProp } from "@react-navigation/stack";
import { IRotas } from "../../routes/interfaceRotas";
import { Route } from "@react-navigation/native";
import { ICategoria } from "../../interfaces/ICategoria";

export type ListaEventosProp = {
    navigation: StackNavigationProp<IRotas, 'ListaEventos'>;
    route: Route<"ListaEventos", {
        eventosUsuario?: boolean;
        mostrarFiltros?: boolean;
    }>
}

export interface IFiltrosEventos {
    categoria?: ICategoria | null;
    data?: string | null;
    hora?: string | null;
    ordenacao?: string | null;
}