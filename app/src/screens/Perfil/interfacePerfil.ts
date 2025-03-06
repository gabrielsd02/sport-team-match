import { StackNavigationProp } from "@react-navigation/stack";
import { Route } from "@react-navigation/native";

import { IRotas } from "../../routes/interfaceRotas";

export type PerfilProps = {
    navigation: StackNavigationProp<IRotas, 'Perfil'>,
    route: Route<"Perfil", {
        mostrarModalSair?: boolean
    }>
}