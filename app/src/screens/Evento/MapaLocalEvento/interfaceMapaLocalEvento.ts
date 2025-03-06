import { ICoordenadas } from "../../../interfaces/ICoordenadas";
import { ILocalizacao } from "../../../interfaces/ILocalizacao";

export interface IMapaLocalEventoProps {
    cores: any;
    encerrado: boolean;
    localEvento: string | null;
    coordenadasEvento: ICoordenadas | null;
    setLocalEvento: (valor: string | null) => void;
    setMostrarMapa: (valor: boolean) => void;
    setCoordenadasEvento: (valor: ICoordenadas | null) => void;
    consultaEnderecoAtual: (coordenadasConsulta: ICoordenadas) => Promise<{
        endereco: string;
        latitude: number;
        longitude: number;
    } | undefined>
}