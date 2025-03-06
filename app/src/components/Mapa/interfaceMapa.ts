import { ReactNode } from "react";
import { LatLng } from "react-native-maps";

import { ILocalizacao } from "../../interfaces/ILocalizacao";

export interface IMapaProps {
    children?: ReactNode;
    cliqueMapa?: (e: LatLng) => void;
    localizacaoUsuario: ILocalizacao;
}