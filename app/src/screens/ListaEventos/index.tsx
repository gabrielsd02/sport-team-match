import { 
    useCallback,
    useState 
} from "react";
import { 
    FontAwesome, 
    FontAwesome5 
} from '@expo/vector-icons';
import { 
    FlatList,
    RefreshControl, 
    View 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components";
import axios, { AxiosResponse } from "axios";

import { 
    Container, 
    Texto 
} from "../../components";
import {
    BotaoCadastro,
    BotaoPaginacao,
    ContainerLista,
    ContainerRodape,
    ContainerPaginacao
} from './styles';
import { 
    IFiltrosEventos, 
    ListaEventosProp 
} from "./interfaceListaEventos";
import { IEventoRetorno } from "../../interfaces/IEvento";
import { getIdUsuario } from "../../../store/reducerUsuario";
import { ICategoria } from "../../interfaces/ICategoria";
import ItemEvento from "./ItemEvento";
import Filtros from "./Filtros";

export default function ListaEventos(props: ListaEventosProp) {

    const idUsuario = useSelector(getIdUsuario);
    const { cores, textoTamanho } = useTheme();
    const { navigation, route } = props;
    const [carregando, setCarregando] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [eventos, setEventos] = useState<IEventoRetorno['eventos']>([]);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [filtrosEventos, setFiltrosEventos] = useState({} as IFiltrosEventos);
    
    async function consultarEventos(pag: number, filtros: IFiltrosEventos) {

        setCarregando(true);

        // prepara url
        const url = route?.params?.eventosUsuario ? `/evento/lista/${idUsuario}` : '/evento/lista/eventos';
        
        // prepara os parametros para a listagem
        const parametros = {
            pagina: pag,
            registrosPorPagina: 10
        } as any;
        
        // verifica se adiciona aos parametrosd
        if(!route?.params?.eventosUsuario) parametros['idUsuarioCriador'] = idUsuario;
        if(filtros.categoria) parametros['idCategoria'] = filtros.categoria.id;
        if(filtros.data)      parametros['dataFiltro']  = filtros.data;
        if(filtros.hora)      parametros['horaFiltro']  = filtros.hora;
        if(filtros.ordenacao) parametros['ordenacao']   = filtros.ordenacao;
        
        try {
            
            const { data }: AxiosResponse<IEventoRetorno> = await axios.get(url, {
                params: {
                    ...parametros
                }
            });
            setCategorias(data.categorias);
            setEventos(data.eventos);
            setTotalPaginas(data.totalPaginas > 0 ? data.totalPaginas : 1);
            setTotal(data.totalRegistros);

        } catch(e: any) {
            console.error(e.response);
        } finally {
            setCarregando(false);
        }        

    }

    useFocusEffect(
        useCallback(() => {
            return () => {
                setEventos([]);
                setPagina(1);
            };
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            consultarEventos(pagina, filtrosEventos);
        }, [pagina, filtrosEventos])
    );
    
    return (<>
        <Container>
            <ContainerLista>
                <FlatList
                    data={eventos}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ItemEvento 
                            evento={item}
                            onClick={() => {
                                navigation.navigate("Evento", {
                                    id: item.id
                                });
                            }}
                        />
                    )}                    
                    persistentScrollbar
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                    refreshControl={<RefreshControl 
                        refreshing={carregando} 
                        onRefresh={() => consultarEventos(pagina, filtrosEventos)}
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
                            Eventos não encontrados :(
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
                {(route?.params?.eventosUsuario) && <BotaoCadastro 
                    onPress={() => {
                        navigation.navigate("Evento");
                    }}
                >
                    <FontAwesome5 
                        name={'plus'}
                        size={40} 
                        color="white" 
                    />
                </BotaoCadastro>}
            </ContainerRodape>
        </Container>
        {(route?.params?.mostrarFiltros) && <Filtros 
            fechar={() => navigation.setParams({ mostrarFiltros: false })}
            categorias={categorias}
            textoTamanho={textoTamanho}
            filtros={filtrosEventos}
            alterarFiltros={setFiltrosEventos}
        />}
    </>);

}