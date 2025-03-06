import { 
    memo, 
    useEffect, 
    useState 
} from "react";
import { 
    Text, 
    BackHandler 
} from "react-native";
import { Marker } from "react-native-maps";
import { FontAwesome } from '@expo/vector-icons'; 

import { 
    ContainerBotao,
    BotaoConfirmaLocal,
    ContainerTextoInput,
    ContainerInputLocalTexto,
    ContainerMapaLocalEvento
} from "./styles";
import { InputEvento } from "../styles";
import { ICoordenadas } from "../../../interfaces/ICoordenadas";
import { IMapaLocalEventoProps } from "./interfaceMapaLocalEvento";
import Mapa from "../../../components/Mapa";

function MapaLocalEvento({
    cores,
    encerrado,
    localEvento,
    coordenadasEvento,
    setLocalEvento,
    setMostrarMapa,
    setCoordenadasEvento,
    consultaEnderecoAtual
}: IMapaLocalEventoProps) {

    const [localEventoMapa, setLocalEventoMapa] = useState<string | null>(localEvento);
    const [coordenadasEventoMapa, setCoordenadasEventoMapa] = useState<any>(
        (coordenadasEvento && coordenadasEvento.latitude && coordenadasEvento.longitude) ? 
        { latitude: coordenadasEvento.latitude, longitude: coordenadasEvento.longitude } :
        null
    );

    useEffect(() => {
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setMostrarMapa(false);
            return true;
        });
    
        return () => backHandler.remove();
        
    }, []);

    return (
        <ContainerMapaLocalEvento>
            <ContainerInputLocalTexto>
                <ContainerTextoInput>
                    <Text
                        style={{
                            fontSize: 12
                        }}
                    >
                        *Clique no mapa para apontar o local do evento.
                    </Text>
                    <Text 
                        style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                        }}
                    >
                        Local: 
                    </Text>
                    <InputEvento 
                        value={localEventoMapa ?? ''}
                        onChangeText={(text) => setLocalEventoMapa(text)}
                        placeholder='Local do evento'
                        cursorColor={'black'}
                        placeholderTextColor={cores.textoOpaco}
                        textAlign="left"       
                        multiline    
                        textAlignVertical="top"
                        editable={!encerrado}
                        style={{
                            color: 'black',
                            paddingBottom: 2,
                            borderBottomWidth: 1,
                            borderBottomColor: 'gray'
                        }}
                    />
                </ContainerTextoInput>
            </ContainerInputLocalTexto>
            <ContainerBotao>
                <BotaoConfirmaLocal
                    onPress={() => {
                        setLocalEvento(localEventoMapa);
                        setCoordenadasEvento(coordenadasEventoMapa);
                        setMostrarMapa(false);
                    }}
                >
                    <FontAwesome 
                        name="check"
                        color={'white'}
                        size={45}
                    />
                </BotaoConfirmaLocal>
            </ContainerBotao>
            <Mapa 
                localizacaoUsuario={coordenadasEventoMapa}
                cliqueMapa={async (coordenadas: ICoordenadas) => {
                    const retornoEndereco = await consultaEnderecoAtual(coordenadas);
                    if(retornoEndereco) {
                        setLocalEventoMapa(retornoEndereco.endereco);                        
                        setCoordenadasEventoMapa(coordenadas);
                    }
                }}
            >
                {(coordenadasEventoMapa) && <Marker 
                    anchor={{
                        x: 0.5,
                        y: 0.5
                    }}
                    zIndex={2}
                    tracksViewChanges={false}
                    coordinate={{
                        latitude: coordenadasEventoMapa.latitude,
                        longitude: coordenadasEventoMapa.longitude
                    }}                      
                />}
            </Mapa>
        </ContainerMapaLocalEvento>
    );

}

export default memo(MapaLocalEvento);