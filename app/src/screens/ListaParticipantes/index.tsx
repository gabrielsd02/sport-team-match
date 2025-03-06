import { 
    useCallback, 
    useState 
} from "react";
import { 
    Alert,
    FlatList,
    RefreshControl, 
    View 
} from "react-native";
import { useTheme } from "styled-components";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import axios, { AxiosResponse } from "axios";

import { 
    Alerta,
    Container, 
    Texto 
} from "../../components"
import { 
    BotaoAdicaoParticipante,
    BotaoPaginacao, 
    ContainerLista, 
    ContainerPaginacao, 
    ContainerRodape 
} from "./styles"
import { 
    ListaParticipantesProp, 
    ParticipantesEventoResponse 
} from "./interfaceListaParticipantes";
import { getIdUsuario } from "../../../store/reducerUsuario";
import { IEvento } from "../../interfaces/IEvento";
import { ErroRequisicao } from "../../../interface";
import ItemParticipante from "./ItemParticipante";
import ModalParticipante from "../../components/ModalParticipante";


export default function ListaParticipantes(props: ListaParticipantesProp) {
    
    const { cores, textoTamanho } = useTheme();
    const { navigation, route } = props;
    const idUsuario = useSelector(getIdUsuario);
    const [carregando, setCarregando] = useState(false);
    const [participando, setParticipando] = useState(false);
    const [dadosEvento, setDadosEvento] = useState({} as IEvento);
    const [participanteSelecionado, setParticipanteSelecionado] = useState<ParticipantesEventoResponse['participantes'][0] | null>(null);
    const [participantes, setParticipantes] = useState<ParticipantesEventoResponse['participantes']>([]);
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [alerta, setAlerta] = useState({
        mostrar: false,
        idParticipante: null
    } as { 
        mostrar: boolean; 
        idParticipante: null | number
    });
    const idEvento = route.params.idEvento;
    
    async function consultarParticipantesEvento(pag: number) {

        setCarregando(true);

        const parametros = {
            pagina: pag,
            registrosPorPagina: 10
        } as any;

        try {
            
            const { data }: AxiosResponse<ParticipantesEventoResponse> = await axios
                .get(`/participante/evento/${idEvento}`, {
                    params: {
                        ...parametros
                    }
                })
            ;           
            setDadosEvento(data.dadosEvento);
            setParticipantes(data.participantes);
            setTotalPaginas(data.totalPaginas > 0 ? data.totalPaginas : 1);
            setTotal(data.totalRegistros);

            const idsUsuariosParticipantes = data.participantes.map(p => p.idUsuario);
            setParticipando(idsUsuariosParticipantes.includes(idUsuario));

        } catch(e: any) {
            console.error(e.response);
        } finally {
            setCarregando(false);
        }   

    }
    
    async function removerParticipante(id: number) {

        setCarregando(true);

        try {

            await axios.delete(`/participante/${id}`);
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: `Participante removido com sucesso!`,
                position: 'top'
            });
            consultarParticipantesEvento(pagina);

        } catch(error: any) {
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
                Alert.alert("Erro!", "Houve um erro ao remover o participante. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregando(false);
        }

    }

    useFocusEffect(
        useCallback(() => {
            return () => {
                setParticipantes([]);
                setPagina(1);
            };
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            consultarParticipantesEvento(pagina);
        }, [pagina])
    );
    
    return (<>
        <Container>
            <ContainerLista>
                <FlatList 
                    data={participantes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ItemParticipante 
                            criador={idUsuario === dadosEvento?.idUsuarioCriador}
                            idUsuarioCriador={dadosEvento?.idUsuarioCriador}
                            participante={item}
                            cliqueParticipante={() => setParticipanteSelecionado(item)}
                            deletarParticipante={(id) => {
                                setAlerta({
                                    mostrar: true,
                                    idParticipante: id
                                })
                            }}
                        />
                    )}                    
                    persistentScrollbar
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                    refreshControl={<RefreshControl 
                        refreshing={carregando} 
                        onRefresh={() => consultarParticipantesEvento(pagina)}
                    />}
                    ListEmptyComponent={<View 
                        style={{ 
                            flex:1, 
                            alignItems: 'center' 
                        }}
                    >
                        <Texto
                            style={{
                                fontWeight: 'bold',
                                fontSize: textoTamanho.normal
                            }}
                        >
                            Não há participantes no evento
                        </Texto>
                    </View>}
                />
            </ContainerLista>
            <ContainerRodape>
                <ContainerPaginacao>
                    <BotaoPaginacao
                        style={{
                            opacity: pagina == 1 ? 0.5 : 1
                        }}
                        onPress={() => {
                            if(pagina === 1) return;
                            setPagina(pagina - 1);
                        }}
                    >
                        <FontAwesome 
                            name="caret-left" 
                            size={30} 
                            color={cores.texto} 
                        />
                    </BotaoPaginacao>
                    <Texto
                        style={{
                            fontSize: textoTamanho.normal,
                            fontWeight: 'bold'
                        }}
                    >
                        {pagina} / {totalPaginas}
                    </Texto>
                    <BotaoPaginacao
                        style={{
                            opacity: pagina == totalPaginas ? 0.5 : 1
                        }}
                        onPress={() => {
                            if(pagina == totalPaginas) return;
                            setPagina(pagina + 1);
                        }}
                    >
                        <FontAwesome 
                            name="caret-right" 
                            size={30} 
                            color={cores.texto} 
                        />
                    </BotaoPaginacao>                    
                </ContainerPaginacao>
                {
                    (idUsuario === dadosEvento?.idUsuarioCriador) &&
                    (total < dadosEvento?.limiteParticipantes)
                && <BotaoAdicaoParticipante 
                    onPress={() => {
                        navigation.navigate('ListaUsuarios', {
                            idEvento
                        });
                    }}
                >
                    <Ionicons 
                        name="md-person-add-sharp" 
                        size={35} 
                        color="white" 
                    />
                </BotaoAdicaoParticipante>}
            </ContainerRodape>
        </Container>
        {(participanteSelecionado) && <ModalParticipante 
            idUsuario={idUsuario.toString()}
            idUsuarioCriador={dadosEvento?.idUsuarioCriador}
            participante={participando}
            dadosUsuario={{
                dataNascimento: participanteSelecionado.dataNascimento,
                foto: participanteSelecionado.foto,
                nome: participanteSelecionado.nome,
                telefone: participanteSelecionado.telefone,
                nota: participanteSelecionado?.nota ? Number(participanteSelecionado.nota) : null,
                id: participanteSelecionado.idUsuario,
                sexo: participanteSelecionado.sexo
            }}
            textoTamanho={textoTamanho}
            fechar={() => {
                setParticipanteSelecionado(null);
                consultarParticipantesEvento(pagina);
            }}
        />}
        {alerta.mostrar && <Alerta             
            titulo={"Remover Participante"}
            mensagem={"Você deseja remover o participante?"}            
            textoCancelar={"Não"}
            textoConfirmar={"Sim"}
            fechar={() => setAlerta({
                mostrar: false, 
                idParticipante: null
            })}
            botaoConfirmar={() => {
                const idParticipante = alerta.idParticipante!;
                setAlerta({
                    mostrar: false, 
                    idParticipante: null
                })
                removerParticipante(idParticipante);
            }}
        />}
    </>)

}