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
import { DateTime } from "luxon";
import { useTheme } from "styled-components";
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import axios, { AxiosResponse } from "axios";

import { 
    Container, 
    Texto 
} from "../../components"
import { 
    BotaoPaginacao, 
    ContainerLista, 
    ContainerPaginacao, 
    ContainerRodape 
} from "./styles";
import { 
    ListaUsuariosProp, 
    ListaUsuariosResponse 
} from "./interfaceListaUsuarios";
import { 
    getIdUsuario, 
    getNomeUsuario 
} from "../../../store/reducerUsuario";
import { IEvento } from "../../interfaces/IEvento";
import { ErroRequisicao } from "../../../interface";
import { format } from "../../functions";
import ItemUsuario from "./ItemUsuario";
import ModalParticipante from "../../components/ModalParticipante";

export default function ListaUsuarios(props: ListaUsuariosProp) {
    
    const { cores, textoTamanho } = useTheme();
    const { navigation, route } = props;
    const idUsuario = useSelector(getIdUsuario);
    const nomeUsuario = useSelector(getNomeUsuario);
    const [carregando, setCarregando] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<ListaUsuariosResponse['usuarios'][0] | null>(null);
    const [usuarios, setUsuarios] = useState<ListaUsuariosResponse['usuarios']>([]);
    const [dadosEvento, setDadosEvento] = useState({} as IEvento);
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const idEvento = route.params.idEvento;
    
    async function consultarUsuarios(pag: number) {

        setCarregando(true);

        const parametros = {
            pagina: pag,
            idEvento,
            registrosPorPagina: 15
        } as any;
        
        try {
            
            const { data }: AxiosResponse<ListaUsuariosResponse> = await axios
                .get('/usuario', {
                    params: {
                        ...parametros
                    }
                })
            ;                
            setDadosEvento(data.dadosEvento);
            setUsuarios(data.usuarios);
            setTotalPaginas(data.totalPaginas > 0 ? data.totalPaginas : 1);
            setTotal(data.totalRegistros);

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
                Alert.alert("Erro!", "Houve um erro ao convidar o participante. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregando(false);
        }   

    }

    // convida usuário para participar no evento
    async function convidarUsuario(idUsuarioDestino: number) {
        
        const dataAtual = DateTime.local();
        const dataHoraArray = format(new Date(dadosEvento.dataHoraInicio)).split(' ');
        const data = dataHoraArray[0];
        const hora = dataHoraArray[1];        
        const diferencaDias = DateTime.fromJSDate(new Date(dadosEvento.dataHoraInicio))
            .startOf('day').diff(dataAtual.startOf('day'), 'days')
            .toObject().days
        ;
        
        let diferencaDiasString = (diferencaDias === 0) ? "para hoje" : (diferencaDias === 1 ? "para amanhã" : `no dia ${data}`);
        
        setCarregando(true);

        try {

            await axios.post('/convite', {
                idEvento,
                tipo: 'criador_participante',
                descricao: `O usuário ${nomeUsuario} convidou você para participar do evento: ${dadosEvento.nome}, marcado ${diferencaDiasString} às ${hora}`,
                idUsuarioEmissor: idUsuario,
                idUsuarioDestinatario: idUsuarioDestino
            });
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: `Convite enviado com sucesso!`,
                position: 'top'
            });
            await consultarUsuarios(pagina);

        } catch(e: any) {
            console.error(e.response);
        } finally {
            setCarregando(false);
        } 

    }

    useFocusEffect(
        useCallback(() => {
            return () => {
                setUsuarios([]);
                setPagina(1);
            };
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            consultarUsuarios(pagina);
        }, [pagina])
    );

    return (<>
        <Container>
            <ContainerLista>
                <FlatList 
                    data={usuarios}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ItemUsuario 
                            usuario={item}
                            cliqueUsuario={() => setUsuarioSelecionado(item)}
                            convidarUsuario={(id) => convidarUsuario(id)}
                        />
                    )}                    
                    persistentScrollbar
                    contentContainerStyle={{ padding: 10 }}
                    refreshControl={<RefreshControl 
                        refreshing={carregando} 
                        onRefresh={() => consultarUsuarios(pagina)}
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
                            Não foram encontrados usuários
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
            </ContainerRodape>
        </Container>
        {usuarioSelecionado && <ModalParticipante 
            idUsuario={idUsuario.toString()}
            fechar={() => setUsuarioSelecionado(null)}
            textoTamanho={textoTamanho}
            dadosUsuario={usuarioSelecionado}
        />}
    </>)

}