import { StackNavigationProp } from "@react-navigation/stack";
import { IRotas } from "../../routes/interfaceRotas";
import { Route } from "@react-navigation/native";

export type MapaEventoProp = {
    navigation: StackNavigationProp<IRotas, 'MapaEventos'>;
    route: Route<"MapaEventos">
}