import { 
    useEffect, 
    useState 
} from "react";
import { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import { SvgUri } from "react-native-svg";
import axios, { AxiosResponse } from "axios";

import { getLocalizacao } from "../../../store/reducerLocalizacao";
import { MapaEventoProp } from "./interfaceMapaEventos";
import { ContainerMapa } from "./styles";
import { getIdUsuario } from "../../../store/reducerUsuario";
import { IEventoRetorno } from "../../interfaces/IEvento";
import Mapa from "../../components/Mapa";

export default function MapaEventos(props: MapaEventoProp) {
    
    const { navigation } = props;
    const idUsuario = useSelector(getIdUsuario);
    const localizacaoUsuario = useSelector(getLocalizacao);
    const [eventos, setEventos] = useState<IEventoRetorno['eventos']>([]);

    async function consultaEventosMapa() {

        try {

            const { data }: AxiosResponse<IEventoRetorno> = await axios.get(`/evento/mapa/${idUsuario}`);
            setEventos(data.eventos);

        } catch(e: any) {
            console.error(e?.response);
        } 

    }

    useEffect(() => {
        consultaEventosMapa();
    }, []);

    return (
        <ContainerMapa>
            <Mapa 
                localizacaoUsuario={localizacaoUsuario}
            >
                {eventos.map((e, i) => {
                    return <Marker 
                        key={i}
                        anchor={{
                            x: 0.5,
                            y: 0.5
                        }}
                        zIndex={2}
                        tracksViewChanges={false}
                        coordinate={{
                            latitude: e.latitude,
                            longitude: e.longitude
                        }}
                        onPress={() => {
                            navigation.navigate("Evento", {
                                id: e.id
                            });                   
                        }}                        
                    >
                        <SvgUri 
                            uri={e.categoria.icone}
                            width={35}
                            height={35}
                        />
                    </Marker>
                })}
            </Mapa>
        </ContainerMapa>
    );

}