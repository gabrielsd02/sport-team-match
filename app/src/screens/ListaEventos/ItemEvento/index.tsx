import { 
    memo, 
    useEffect, 
    useState 
} from "react";
import { 
    Animated,
    Text,
    View
} from "react-native";
import { 
    AntDesign, 
    Ionicons, 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons';
import { SvgUri } from "react-native-svg";
import { useTheme } from "styled-components";

import { 
    verificaCorCategoria, 
    formataDuracao,
    format
} from "../../../functions";
import {
    BotaoItem,
    ContainerItem,
    ContainerTitulo,
    ContainerTopbarItem,
    ContainerTituloTextos,
    ContainerDadosEvento,
    ContainerIconeCategoria,
    ContainerBotaoExpandir,
    BotaoExpandir,
    ContainerInformacoesEvento,
    ContainerDescricao,
    TextoDescricao,
    ContainerDados,
    ContainerIconeDado,
    ContainerIconeTexto,
    ContainerStatusEvento,
    TextoParticipando
} from './styles';
import { Texto } from "../../../components";
import { IItemEvento } from "./interfaceItemEvento";

function ItemEvento({
    evento,
    onClick
}: IItemEvento) {
    
    const dataHoraArray = format(new Date(evento.dataHoraInicio)).split(' ');
    const { textoTamanho } = useTheme();
    
    const [expandido, setExpandido] = useState(false);
    const alturaAnimada = new Animated.Value(130);
    const data = dataHoraArray[0];
    const hora = dataHoraArray[1];
    
    useEffect(() => {
        
        Animated.timing(alturaAnimada, {
            toValue: !expandido ? 130 : 175,
            duration: 300,
            useNativeDriver: false
        }).start();

    }, [expandido])

    return (
        <ContainerItem
            style={{ 
                height: alturaAnimada, 
                opacity: evento.encerrado ? 0.5 : 1,
                backgroundColor: verificaCorCategoria(evento.categoria.nome), 
                elevation: 4
            }}
        >
            <BotaoItem 
                onPress={onClick}
            >
                <ContainerTopbarItem>
                    <ContainerTituloTextos>
                        <ContainerStatusEvento>
                            <Texto
                                style={{
                                    marginTop: -2,
                                    color: evento.encerrado ? 'red' : 'green',
                                    fontWeight: 'bold'                                    
                                }}
                            >
                                {evento.encerrado ? 'Encerrado' : 'Ativo'}
                            </Texto>
                            {(
                                evento.participando &&
                                evento.participando === "S"
                            ) && <TextoParticipando>
                                Participando
                            </TextoParticipando>}
                        </ContainerStatusEvento>
                        <ContainerTitulo>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: textoTamanho.normal                        
                                }}
                                numberOfLines={1}
                            >
                                {evento.nome}
                            </Text>
                        </ContainerTitulo>
                    </ContainerTituloTextos>
                </ContainerTopbarItem>
                <ContainerDadosEvento>
                    <ContainerIconeCategoria>
                        <SvgUri 
                            width={60}
                            height={60}
                            uri={evento.categoria.icone}
                        />
                    </ContainerIconeCategoria>
                    <ContainerInformacoesEvento>
                        {expandido && <ContainerDescricao>
                            <TextoDescricao>
                                {evento.descricao}
                            </TextoDescricao>
                        </ContainerDescricao>}
                        <ContainerDados>
                            <ContainerIconeTexto>
                                <ContainerIconeDado>
                                    <Ionicons
                                        name="calendar" 
                                        size={14} 
                                    />
                                </ContainerIconeDado>
                                <Text>
                                    {data}
                                </Text>
                            </ContainerIconeTexto>                        
                            <ContainerIconeTexto>
                                <FontAwesome5
                                    name="clock" 
                                    size={14} 
                                />
                                <Text>
                                    {hora}
                                </Text>
                            </ContainerIconeTexto>
                        </ContainerDados>
                        <ContainerIconeTexto 
                            style={{ 
                                justifyContent: 'flex-start', 
                                width: '100%' 
                            }}
                        >
                            <ContainerIconeDado>
                                <FontAwesome5 
                                    name="map-marked-alt" 
                                    size={14} 
                                />
                            </ContainerIconeDado>
                            <Text 
                                numberOfLines={expandido ? 3 : 1}
                                style={{
                                    textAlign: 'left'
                                }}
                            >
                                {evento.local}
                            </Text>
                        </ContainerIconeTexto>
                        <ContainerDados>
                            <ContainerIconeTexto>
                                <ContainerIconeDado>
                                    <FontAwesome5 
                                        name="hourglass-half" 
                                        size={14} 
                                        style={{
                                            marginTop: 1
                                        }}
                                    />
                                </ContainerIconeDado>
                                <Text>
                                    {formataDuracao(evento.duracao)}
                                </Text>
                            </ContainerIconeTexto>
                            <ContainerIconeTexto 
                                style={{  minWidth: 60, paddingLeft: 3, justifyContent: 'flex-start' }}
                            >
                                <FontAwesome
                                    name="group" 
                                    size={14} 
                                />
                                <Text>
                                    {evento.totalParticipantes}/{evento.limiteParticipantes}
                                </Text>
                            </ContainerIconeTexto>
                        </ContainerDados>
                    </ContainerInformacoesEvento>
                    <ContainerBotaoExpandir>
                        <BotaoExpandir
                            onPress={() => setExpandido(!expandido)}
                        >
                            <AntDesign
                                name={expandido ? "up" : "down"} 
                                size={28} 
                                color="black" 
                            />
                        </BotaoExpandir>
                    </ContainerBotaoExpandir>
                </ContainerDadosEvento>
            </BotaoItem>
        </ContainerItem>
    );

}

export default memo(ItemEvento);