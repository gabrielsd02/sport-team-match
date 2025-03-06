import { 
    ActivityIndicator,
    Alert,
    Modal, 
    TouchableOpacity, 
    View 
} from "react-native";
import { 
    FontAwesome, 
    FontAwesome5 
} from '@expo/vector-icons'; 
import { 
    memo, 
    useEffect, 
    useState 
} from "react";
import { Image } from "expo-image";
import { DateTime } from "luxon";
import Toast from "react-native-toast-message";
import axios, { AxiosResponse } from "axios";

import { 
    InputDado,
    BotaoFechar,
    BotaoSalvar,
    ContainerNota,
    ContainerImagem,
    FundoPressionavel,
    ContainerBotoes,
    ContainerIconeTexto,
    ContainerDadosUsuario,
    ContainerParticipante
} from './styles'
import { ErroRequisicao } from "../../../interface";
import { IModalParticipanteProps } from "./interfaceModalParticipante";
import { IAvaliacoesUsuarios } from "../../interfaces/IAvaliacao";
import Texto from "../Texto";

function ModalParticipante({
    fechar,
    idUsuario,
    participante,
    textoTamanho,
    dadosUsuario,
    idUsuarioCriador
}: IModalParticipanteProps) {

    const distancia = dadosUsuario?.distancia ? (dadosUsuario.distancia < 1000) ? `${dadosUsuario.distancia}m` : `${(dadosUsuario.distancia/1000).toFixed(2).replace('.', ',')}Km` : null;
    const dataNascimento = DateTime.fromISO(dadosUsuario.dataNascimento);
    const diferencaDataNascimento = DateTime.now().diff(dataNascimento, ['years']).toObject().years?.toString(); 
    const mesmoUsuario = idUsuario === dadosUsuario.id.toString();
    const participanteCriadorEvento = dadosUsuario.id === idUsuarioCriador;
    const usuarioCriador = idUsuarioCriador ? idUsuario === idUsuarioCriador.toString() : false;
    
    const [carregando, setCarregando] = useState(false);
    const [idNotaAvaliacao, setIdNotaAvaliacao] = useState<number | null>(null);
    const [notaAvaliador, setNotaAvaliador] = useState(0);
    
    async function salvarNota() {

        setCarregando(true);

        const parametros = {
            idUsuarioAvaliador: idUsuario,
            idUsuarioAlvo: dadosUsuario.id,
            nota: notaAvaliador
        };
        
        const url = !idNotaAvaliacao ? '/avaliacoes' : `/avaliacoes/${idNotaAvaliacao}`;
        const requisicao = idNotaAvaliacao ? axios.put : axios.post;
        
        try {

            await requisicao(url, parametros);
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: `Avaliação realizada com sucesso!`,
                position: 'top'
            });
            fechar();

        } catch(error: any) {
            console.error(error);
            const erro = error as ErroRequisicao;
            console.error(erro?.response ? erro.response.data : erro);
            if(erro.response && erro.response.data) {
                Toast.show({
                    type: 'error',
                    topOffset: 100,
                    visibilityTime: 3000,
                    text1: 'Erro!',
                    text2: erro.response.data.message,
                    position: 'top'
                });
            } else {
                Alert.alert("Erro!", "Houve um erro ao enviar a avaliação. Verifique sua conexão com a internet.");
            }
        } finally {

            setCarregando(false);

        }

    }

    async function consultarAvaliacaoUsuarios() {

        setCarregando(true);

        try {

            const { data }: AxiosResponse<IAvaliacoesUsuarios | null> = await axios.get('/avaliacoes', {
                params: {
                    idUsuarioAvaliador: idUsuario,
                    idUsuarioAlvo: dadosUsuario.id
                }
            });

            if(data) {
                setIdNotaAvaliacao(data.id);
                setNotaAvaliador(data.nota);
            }

        } catch(error: any) {
            console.error(error?.response);
        } finally {
            setCarregando(false);
        }

    }

    useEffect(() => {
        if(participante) {
            consultarAvaliacaoUsuarios();
        }
    }, [])
    
    return (
        <Modal
            animationType="fade"
            visible
            onRequestClose={fechar}
            transparent
            style={{ position: 'relative' }}
        >
            <FundoPressionavel
                onPress={fechar}
            >
                <ContainerParticipante
                    style={{
                        shadowColor: 'white',
                        shadowOpacity: 0.25,
                        justifyContent: 'center',
                        elevation: 6
                    }}
                    onPress={(e) => e.preventDefault()}
                >
                    {(!carregando) ? <>
                        <ContainerImagem>
                            {(dadosUsuario.foto) ? <Image
                                source={dadosUsuario.foto}
                                contentFit="cover"
                                contentPosition={"center"}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 100
                                }}
                            /> : <FontAwesome5 
                                name={'user'}
                                color={'gray'}
                                size={75}
                            />}                        
                        </ContainerImagem>
                        <ContainerDadosUsuario>
                            <ContainerIconeTexto>
                                <Texto
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: textoTamanho.abaixoNormal
                                    }}
                                    numberOfLines={1}
                                >
                                    Nome
                                </Texto>
                            </ContainerIconeTexto>
                            <InputDado
                                value={dadosUsuario.nome ?? ''}
                                editable={false}
                            />                        
                        </ContainerDadosUsuario>
                        <View
                            style={{
                                width: '95%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <ContainerDadosUsuario
                                style={{ width: 'auto' }}
                            >
                                <ContainerIconeTexto>
                                    <Texto
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: textoTamanho.abaixoNormal
                                        }}
                                        numberOfLines={1}
                                    >
                                        Sexo
                                    </Texto>
                                </ContainerIconeTexto>
                                <InputDado
                                    value={dadosUsuario.sexo ? (dadosUsuario.sexo.toUpperCase() === 'M' ? "Masculino" : "Feminino") : '' ?? ''}
                                    editable={false}
                                    style={{
                                        width: 120
                                    }}
                                />                        
                            </ContainerDadosUsuario>
                            <ContainerDadosUsuario
                                style={{ width: 'auto' }}
                            >
                                <ContainerIconeTexto>
                                    <Texto
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: textoTamanho.abaixoNormal
                                        }}
                                        numberOfLines={1}
                                    >
                                        Idade
                                    </Texto>
                                </ContainerIconeTexto>
                                <InputDado
                                    value={diferencaDataNascimento ? parseInt(diferencaDataNascimento).toString() + ' anos': ''}
                                    editable={false}
                                    style={{
                                        width: 120
                                    }}
                                />                        
                            </ContainerDadosUsuario>
                        </View>
                        {(participante && participanteCriadorEvento) && <ContainerDadosUsuario>
                            <ContainerIconeTexto>
                                <Texto
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: textoTamanho.abaixoNormal
                                    }}
                                    numberOfLines={1}
                                >
                                    Telefone
                                </Texto>
                            </ContainerIconeTexto>
                            <InputDado
                                value={dadosUsuario?.telefone ?? ''}
                                editable={false}
                            />                        
                        </ContainerDadosUsuario>}
                        {(dadosUsuario?.distancia) && <ContainerDadosUsuario>
                            <ContainerIconeTexto>
                                <FontAwesome5 
                                    name="map-marker-alt" 
                                    size={24} 
                                    color="white" 
                                    style={{ lineHeight: 24, marginTop: 1 }}
                                />
                                <Texto
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: textoTamanho.abaixoNormal
                                    }}
                                    numberOfLines={1}
                                >
                                    Distância
                                </Texto>
                            </ContainerIconeTexto>
                            <InputDado
                                value={distancia ?? ''}
                                editable={false}
                            />                        
                        </ContainerDadosUsuario>}
                        {(
                            !participante || 
                            (usuarioCriador && !mesmoUsuario)
                        ) && <View
                            style={{
                                width: '95%'
                            }}
                        >                    
                            <Texto 
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: textoTamanho.abaixoNormal
                                }}
                                numberOfLines={1}
                            >
                                Avaliação do usuário:
                            </Texto>
                        </View>}
                        {(
                            !participante || 
                            (usuarioCriador && !mesmoUsuario)
                        ) && <ContainerNota>
                            {(dadosUsuario.nota) ? 
                                [1,2,3,4,5].map((n, i) => (
                                    <FontAwesome              
                                        key={i}                           
                                        name={(dadosUsuario.nota ? parseInt(dadosUsuario.nota+'') : 0) >= n ? "star" : "star-o"} 
                                        size={40} 
                                        color={"yellow"} 
                                        style={{
                                            opacity: participante && (idUsuario === dadosUsuario.id.toString()) ? 0.5 : 1
                                        }}
                                    />
                                )) : 
                                <Texto
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: textoTamanho.quasePequeno
                                    }}
                                    numberOfLines={1}
                                >
                                    O usuário ainda não recebeu avaliações
                                </Texto>                                                       
                            }
                        </ContainerNota>}
                        {(participante && !mesmoUsuario) && <View
                            style={{
                                width: '95%'
                            }}
                        >                    
                            <Texto 
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: textoTamanho.abaixoNormal
                                }}
                                numberOfLines={1}
                            >
                                Sua avaliação ao usuário:
                            </Texto>
                        </View>}
                        {(participante && !mesmoUsuario) && <ContainerNota>
                            {[1,2,3,4,5].map((n, i) => (
                                <TouchableOpacity
                                    key={i}      
                                    onPress={() => {
                                        setNotaAvaliador(n);
                                    }}
                                    activeOpacity={0.5}
                                >
                                    <FontAwesome                                                                       
                                        name={notaAvaliador >= n ? "star" : "star-o"} 
                                        size={40} 
                                        color={"yellow"} 
                                        style={{
                                            opacity: participante && (idUsuario === dadosUsuario.id.toString()) ? 0.5 : 1
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}                                                                           
                        </ContainerNota>}
                        <ContainerBotoes>
                            <BotaoFechar
                                onPress={() =>  fechar()}
                            >
                                <Texto
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: textoTamanho.quasePequeno
                                    }}
                                    numberOfLines={1}
                                >
                                    Fechar
                                </Texto>
                            </BotaoFechar>
                            {(
                                participante && 
                                (idUsuario !== dadosUsuario.id.toString())
                            ) && <BotaoSalvar
                                onPress={() =>  {
                                    if(notaAvaliador > 0) salvarNota();
                                }}
                            >
                                <Texto
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: textoTamanho.quasePequeno
                                    }}
                                    numberOfLines={1}
                                >
                                    Avaliar
                                </Texto>
                            </BotaoSalvar>}
                        </ContainerBotoes>
                    </> : <ActivityIndicator 
                        size={50}
                        color={'white'}
                    />} 
                </ContainerParticipante>
            </FundoPressionavel>
        </Modal>
    );

}

export default memo(ModalParticipante);