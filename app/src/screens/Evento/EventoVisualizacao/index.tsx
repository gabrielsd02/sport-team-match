import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity
} from "react-native";
import { 
    Ionicons,
    FontAwesome,
    FontAwesome5,
    MaterialCommunityIcons 
} from '@expo/vector-icons'; 
import { memo } from "react";
import { SvgUri } from "react-native-svg";
import * as Clipboard from 'expo-clipboard';

import {
    TextoValor,
    ContainerValor,
    LabelTexto,
    ContainerValores,
    ContainerTitulo
} from './styles';  
import { Texto } from "../../../components";
import { primeiraLetraMaiuscula } from "../../../functions";
import { EventoVisualizacaoProps } from './interfaceEventoVisualizacao';
import { ContainerIconeLabel } from "../styles";

function EventoVisualizacao({
    categoriaSelecionada,
    cores,
    textoTamanho,
    titulo,
    descricao,
    data,
    localEvento,
    valorEntrada,
    hora,
    duracao,
    limiteParticipantes,
    totalParticipantes,
    usuarioCriador
}: EventoVisualizacaoProps) {
    
    const totalPessoas = totalParticipantes; // participantes + criador
    const numeroLimiteParticipantesNumero = parseInt(limiteParticipantes);
    const mensagemParticipantesFaltando = (
        (numeroLimiteParticipantesNumero - totalPessoas) === 0 ? '' :
        `- Faltam ${numeroLimiteParticipantesNumero - totalPessoas} participantes.`
    );

    function converterTempoParaTexto(tempoString: string) {

        // Dividir a string em horas e minutos
        const [horasStr, minutosStr] = tempoString.split(':');
        
        // Converter as partes em números inteiros
        let horas = parseInt(horasStr);
        let minutos = parseInt(minutosStr);
        
        // Verificar se há uma hora e/ou minutos
        let resultado = '';
        
        if (horas > 0) {
            resultado += `${horas} hora${horas > 1 ? 's' : ''}`;
        }
        
        if (minutos > 0) {
            if (resultado.length > 0) {
                resultado += ' e ';
            }
            resultado += `${minutos} minuto${minutos > 1 ? 's' : ''}`;
        }
    
        return resultado;
    }

    const copiarTexto = async () => {
        await Clipboard.setStringAsync(localEvento);
    };

    return (<>
        <ContainerTitulo 
            style={{
                elevation: 1
            }}
        >
            <Texto
                style={{
                    fontWeight: 'bold',
                    fontSize: textoTamanho.medio,
                    borderBottomColor: 'white',
                    textAlign: 'center',
                    marginBottom: 10,
                    borderBottomWidth: 2,
                    paddingHorizontal: 10
                }}
                numberOfLines={2}
            >
                {titulo}
            </Texto>
            <View
                style={{
                    width: '100%',
                    gap: 5,
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: textoTamanho.quasePequeno
                    }}
                    numberOfLines={1}
                >
                    Categoria: {categoriaSelecionada ? primeiraLetraMaiuscula(categoriaSelecionada.nome): ''}
                </Text>
                {categoriaSelecionada && <SvgUri 
                    width={24}
                    height={24}
                    uri={categoriaSelecionada.icone}
                />}
            </View>
            <View
                style={{
                    width: '100%',
                    gap: 5,
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: textoTamanho.quasePequeno
                    }}
                    numberOfLines={1}
                >
                    Criador: {usuarioCriador?.nome ?? ''}
                </Text>
            </View>
        </ContainerTitulo>
        <ContainerIconeLabel
            style={{
                marginTop: 10
            }}
        >
            <MaterialCommunityIcons 
                name="text-box" 
                size={24} 
                color={cores.texto} 
                style={{ 
                    lineHeight: 24,
                     marginTop: 1 
                }}
            />
            <Texto
                style={{
                    fontWeight: 'bold',
                    marginLeft: 5,
                    fontSize: textoTamanho.abaixoNormal
                }}
                numberOfLines={1}
            >
                Descrição
            </Texto>
        </ContainerIconeLabel>
        <ScrollView 
            style={{
                maxHeight: 100,
                borderRadius: 3,
                backgroundColor: 'rgba(20, 69, 121, 0.5)',
                elevation: 1
            }}
            contentContainerStyle={{  
                padding: 10,               
                flexGrow: 1      
            }}
            showsVerticalScrollIndicator
        >
            <TextoValor>
                {descricao}
            </TextoValor>
        </ScrollView>
        <ContainerValores>
            <View
                style={{
                    gap: 10
                }}
            >
                <ContainerIconeLabel
                    style={{
                        marginTop: 10
                    }}
                >
                    <Ionicons
                        name="calendar" 
                        size={24} 
                        color={cores.texto} 
                        style={{ lineHeight: 24, marginTop: 1 }}
                    />
                    <Texto
                        style={{
                            fontWeight: 'bold',
                            marginLeft: 5,
                            fontSize: textoTamanho.abaixoNormal
                        }}
                        numberOfLines={1}
                    >
                        Data
                    </Texto>
                </ContainerIconeLabel>
                <ContainerValor 
                    style={{
                        width: 140,
                        elevation: 1
                    }}
                >
                    <TextoValor
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        {data}
                    </TextoValor>
                </ContainerValor>
            </View>
            <View
                style={{
                    gap: 10
                }}
            >
                <ContainerIconeLabel
                    style={{
                        marginTop: 10
                    }}
                >
                    <FontAwesome5
                        name="clock" 
                        size={24} 
                        color={cores.texto}
                        style={{ lineHeight: 24, marginTop: 1 }}
                    />
                    <Texto
                        style={{
                            fontWeight: 'bold',
                            marginLeft: 5,
                            fontSize: textoTamanho.abaixoNormal
                        }}
                        numberOfLines={1}
                    >
                        Hora
                    </Texto>
                </ContainerIconeLabel>
                <ContainerValor
                    style={{
                        elevation: 1,
                        width: 140
                    }}
                >
                    <TextoValor
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        {hora}
                    </TextoValor>
                </ContainerValor>
            </View>
        </ContainerValores>
        <ContainerIconeLabel
            style={{
                marginTop: 10,
                marginBottom: 5
            }}
        >
            <FontAwesome5 
                name="map-marked-alt" 
                size={24} 
                color="white" 
                style={{ lineHeight: 24, marginTop: 1 }}
            />
            <Texto
                style={{
                    fontWeight: 'bold',
                    marginLeft: 5,
                    fontSize: textoTamanho.abaixoNormal
                }}
                numberOfLines={1}
            >
                Local da partida
            </Texto>
        </ContainerIconeLabel>
        <ContainerValor
            style={{
                justifyContent: 'space-between',
                elevation: 1
            }}
        >
            <TextoValor>
                {localEvento}
            </TextoValor>
            <TouchableOpacity
                style={{ 
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={copiarTexto}
            >
                <FontAwesome5 
                    name="copy" 
                    size={24} 
                    color={cores.texto}
                    style={{ lineHeight: 24, marginTop: 1 }}
                />
            </TouchableOpacity>
        </ContainerValor>
        <ContainerIconeLabel
            style={{
                marginTop: 10,
                marginBottom: 5
            }}
        >
            <FontAwesome5 
                name="hourglass-half" 
                size={20} 
                color="white" 
                style={{ lineHeight: 20, marginTop: 2.5 }}
            />
            <Texto
                style={{
                    fontWeight: 'bold',
                    marginLeft: 5,
                    fontSize: textoTamanho.abaixoNormal
                }}
                numberOfLines={1}
            >
                Duração
            </Texto>
        </ContainerIconeLabel>
        <ContainerValor
            style={{
                elevation: 1
            }}
        >
            <TextoValor>
                O evento terá {converterTempoParaTexto(duracao)} de duração
            </TextoValor>
        </ContainerValor>
        <ContainerIconeLabel
            style={{
                marginTop: 10,
                marginBottom: 5
            }}
        >
            <FontAwesome
                name="group" 
                size={24} 
                color="white" 
                style={{ lineHeight: 24, marginTop: 1 }}
            />
            <Texto
                style={{
                    fontWeight: 'bold',
                    marginLeft: 5,
                    fontSize: textoTamanho.abaixoNormal
                }}
                numberOfLines={1}
            >
                Participantes
            </Texto>
        </ContainerIconeLabel>
        <ContainerValor
            style={{ elevation: 1 }}
        >
            <TextoValor>
                {totalPessoas}/{limiteParticipantes} {mensagemParticipantesFaltando}
            </TextoValor>
        </ContainerValor>
        {(valorEntrada) && <>
            <ContainerIconeLabel
                style={{
                    marginTop: 10,
                    marginBottom: 5
                }}
            >
                <FontAwesome5
                    name="dollar-sign" 
                    size={24} 
                    color="white" 
                    style={{ lineHeight: 24, marginTop: 1 }}
                />
                <LabelTexto>
                    Valor da entrada
                </LabelTexto>
            </ContainerIconeLabel>
            <ContainerValor
                style={{ elevation: 1 }}
            >
                <TextoValor>
                    R$ {valorEntrada.replace('.', ',')}
                </TextoValor>
            </ContainerValor>
        </>}
    </>);

}

export default memo(EventoVisualizacao);