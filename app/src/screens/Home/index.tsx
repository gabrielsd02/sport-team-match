import { 
    useEffect, 
    useState, 
    useCallback 
} from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios, { AxiosResponse } from "axios";

import { 
    EmailIcone, 
    JogoEventoIcone, 
    Logo, 
    MapaGoogleIcone, 
    PessoasVoleiIcone 
} from './../../utils/icones';
import { 
    Container, 
    Texto 
} from "../../components";
import {
    TextoOpcao,
    BotaoOpcao,
    ContainerLogo,
    ContainerIcone,
    ContainerRodape,
    ContainerBotoes,
    ContainerBotoesOpcoes,
    ContainerCarregamento,
    ContainerNumeroConvites,
    TextoNumeroConvites
} from './styles';
import { IRotas } from "../../routes/interfaceRotas";
import { getLocalizacao } from "../../../store/reducerLocalizacao";
import { getIdUsuario } from "../../../store/reducerUsuario";

type HomeProps = {
    navigation: StackNavigationProp<IRotas, 'Home'>
}

export default function Home(props: HomeProps) {
    
    const { navigation } = props;
    const [carregando, setCarregando] = useState(false);
    const idUsuario = useSelector(getIdUsuario);
    const localizacao = useSelector(getLocalizacao);
    const [numeroConvites, setNumeroConvites] = useState(0);
    
    async function consultarNumeroConvites() {

        if(!carregando) setCarregando(true);

        try {

            const { data }: AxiosResponse<{quantidade: number}> = await axios.get(`/convite/quantidade/usuario/${idUsuario}`);
            setNumeroConvites(data.quantidade);

        } catch(e: any) {
            console.error(e?.response);
        } finally {
            setCarregando(false);
        }


    }

    async function atualizarLocalizacaoUsuario() {

        if(!carregando) setCarregando(true);

        try {
            
            await axios.put(`/usuario/${idUsuario}`, {
                naoVerificar: true,
                latitude: localizacao.latitude,
                longitude: localizacao.longitude
            });

        } catch(e: any) {
            console.error(e?.response);
        } finally {
            setCarregando(false);
        }

    }

    useEffect(() => {
        if(idUsuario && localizacao?.latitude && localizacao?.longitude) {
            atualizarLocalizacaoUsuario();
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            consultarNumeroConvites();
        }, [])
    );
    
    return (<>
        <Container>
            <ContainerLogo>
                <Logo 
                    width={320}
                    height={50}
                />
            </ContainerLogo>
            {!carregando ? <>
                <ContainerBotoes>
                    <ContainerBotoesOpcoes>
                        <BotaoOpcao
                            style={{
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 12,
                                },
                                shadowOpacity: 0.5,
                                shadowRadius: 16
                            }}
                            onPress={() => {
                                navigation.navigate("ListaEventos");
                            }}
                        >
                            <ContainerIcone>
                                <JogoEventoIcone 
                                    width={100}
                                    height={100}
                                />
                            </ContainerIcone>                        
                            <TextoOpcao> 
                                Lista de Eventos
                            </TextoOpcao>
                        </BotaoOpcao>                        
                        <BotaoOpcao
                            style={{
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 12,
                                },
                                shadowOpacity: 0.5,
                                shadowRadius: 16
                            }}
                            onPress={() => {
                                navigation.navigate("MapaEventos");
                            }}
                        >
                            <ContainerIcone>
                                <MapaGoogleIcone 
                                    width={100}
                                    height={100}
                                />
                            </ContainerIcone>                        
                            <TextoOpcao> 
                                Eventos no Mapa
                            </TextoOpcao>
                        </BotaoOpcao>
                    </ContainerBotoesOpcoes>
                    <ContainerBotoesOpcoes>
                        <BotaoOpcao
                            style={{
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 12,
                                },
                                shadowOpacity: 0.5,
                                shadowRadius: 16
                            }}
                            onPress={() => {
                                navigation.navigate("ListaEventos", {
                                    eventosUsuario: true
                                });
                            }}
                        >
                            <ContainerIcone>
                                <PessoasVoleiIcone 
                                    width={115}
                                    height={115}
                                />
                            </ContainerIcone>                        
                            <TextoOpcao> 
                                Meus Eventos
                            </TextoOpcao>
                        </BotaoOpcao>
                        <BotaoOpcao
                            style={{
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 12,
                                },
                                shadowOpacity: 0.5,
                                shadowRadius: 16
                            }}
                            onPress={() => {
                                navigation.navigate("Convites");
                            }}
                        >
                            <ContainerIcone>
                                <EmailIcone 
                                    width={105}
                                    height={105}
                                />
                            </ContainerIcone>                        
                            <TextoOpcao> 
                                Convites
                            </TextoOpcao>
                            {(numeroConvites > 0) && <ContainerNumeroConvites>
                                <TextoNumeroConvites>
                                    {numeroConvites}
                                </TextoNumeroConvites>
                            </ContainerNumeroConvites>}
                        </BotaoOpcao>                        
                    </ContainerBotoesOpcoes>
                </ContainerBotoes>
            </>: <ContainerCarregamento>
                <ActivityIndicator 
                    size={75}
                    color="white"
                />
            </ContainerCarregamento>}
            <ContainerRodape>
                <Texto
                    style={{
                        fontFamily: 'Inter-Medium'
                    }}
                >
                    Desenvolvido por: Gabriel Souza Domingos
                </Texto>
            </ContainerRodape>
        </Container>
        </>);

}