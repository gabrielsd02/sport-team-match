import { IConviteRetorno } from "../../../interfaces/IConvite";
import { ConvitesProp } from "../interfaceConvite";

export interface ItemConviteProps {
    convite: IConviteRetorno['convites'][0];
    navigation: ConvitesProp['navigation'];
    cliqueUsuario: () => void;
    onClickNegar: (id: number) => void;
    onClickAceitar: (id: number, tipo: string) => void;
}