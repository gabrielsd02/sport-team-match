import { IEventoRetorno } from "../../../interfaces/IEvento";

export interface IItemEvento {
    evento: IEventoRetorno['eventos'][0];
    onClick: () => void;
}