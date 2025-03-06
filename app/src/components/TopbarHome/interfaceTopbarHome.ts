import { StackNavigationProp } from "@react-navigation/stack";
import { IRotas } from "../../routes/interfaceRotas";

export interface ITituloTopoHome {
    texto: string
}

export interface IIconeTopoHome {
    fotoUsuario?: string;
    navigation: StackNavigationProp<IRotas>; 
}