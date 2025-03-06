import { 
    useCallback,
    useState 
} from "react";
import { 
    FlatList,
    RefreshControl, 
    View 
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components";
import Toast from "react-native-toast-message";
import axios, { AxiosResponse } from "axios";

import { 
    Container, 
    Texto 
} from "../../components";
import { 
    BotaoPaginacao, 
    ContainerLista, 
    ContainerPaginacao, 
    ContainerRodape 
} from './styles';
import { getIdUsuario } from "../../../store/reducerUsuario";
import { ConviteConfirmaResponse, ConvitesProp } from "./interfaceConvite";
import { IConviteRetorno } from "../../interfaces/IConvite";
import ItemConvite from "./ItemConvite";
import ModalParticipante from "../../components/ModalParticipante";

export default function Convites(props: ConvitesProp) {

    const idUsuario = useSelector(getIdUsuario);
    const { cores, textoTamanho } = useTheme();
    const { navigation, route } = props;
    const [carregando, setCarregando] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [convites, setConvites] = useState<IConviteRetorno['convites']>([]);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<IConviteRetorno['convites'][0]['usuarioEmissor'] | null>(null);
    
    async function consultarConvites(pag: number) {

        setCarregando(true);
        
        const parametros = {
            pagina: pag,
            idUsuarioDestinatario: idUsuario,
            registrosPorPagina: 10
        } as any;
        
        try {
            
            const { data }: AxiosResponse<IConviteRetorno> = await axios.get('/convite', {
                params: {
                    ...parametros
                }
            });    
            setConvites(data.convites);
            setTotalPaginas(data.totalPaginas > 0 ? data.totalPaginas : 1);
            setTotal(data.totalRegistros);

        } catch(e: any) {
            console.error(e.response);
        } finally {
            setCarregando(false);
        }        

    }

    async function negarConvite(id: number) {

        setCarregando(true);

        try {

            await axios.delete(`/convite/${id}`);
            consultarConvites(pagina);

        } catch(e: any) {
            console.error(e.response);
        } finally {
            setCarregando(false);
        }

    }

    async function aceitarConvite(id: number, tipo: string) {

        setCarregando(true);

        try {

            const { data }: AxiosResponse<ConviteConfirmaResponse> = await axios.post(`/convite/${id}/aceitar`);
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: 'Sucesso!',
                text2: tipo === 'criador_participante' ? `Você foi confirmado no evento ${data.dadosEvento.nome}` : `O usuário ${data.nomeParticipante} foi confirmado no evento ${data.dadosEvento.nome}`,
                position: 'top'
            });
            consultarConvites(pagina);

        } catch(e: any) {
            console.error(e.response);
        } finally {
            setCarregando(false);
        }

    }

    useFocusEffect(
        useCallback(() => {
            return () => {
                setConvites([]);
                setPagina(1);
            };
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            consultarConvites(pagina);
        }, [pagina])
    );
    
    return (<>
        <Container>
            <ContainerLista>
                <FlatList 
                    data={convites}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ItemConvite 
                            convite={item}
                            navigation={navigation}
                            cliqueUsuario={() => setUsuarioSelecionado(item.usuarioEmissor)}
                            onClickNegar={(id) => negarConvite(id)}
                            onClickAceitar={(id, tipo) => aceitarConvite(id, tipo)}
                        />
                    )}                    
                    persistentScrollbar
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                    refreshControl={<RefreshControl 
                        refreshing={carregando} 
                        onRefresh={() => consultarConvites(pagina)}
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
                            Não há convites no momento
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
        {(usuarioSelecionado) && <ModalParticipante 
            idUsuario={idUsuario.toString()}
            dadosUsuario={{
                dataNascimento: usuarioSelecionado.dataNascimento,
                foto: usuarioSelecionado.foto,
                nome: usuarioSelecionado.nome,
                telefone: usuarioSelecionado.telefone,
                nota: usuarioSelecionado?.nota ? Number(usuarioSelecionado.nota) : null,
                id: parseInt(usuarioSelecionado.id),
                sexo: usuarioSelecionado.sexo
            }}
            textoTamanho={textoTamanho}
            fechar={() => {
                setUsuarioSelecionado(null);
            }}
        />}
    </>);

}