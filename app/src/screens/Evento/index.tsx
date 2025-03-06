import { 
    useEffect, 
    useState, 
    useRef 
} from "react";
import { 
    View, 
    Text,
    Alert, 
    Keyboard, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator
} from "react-native";
import { 
    Ionicons,
    FontAwesome,
    FontAwesome5,
    MaterialCommunityIcons 
} from '@expo/vector-icons'; 
import { useSelector } from "react-redux";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SvgUri } from 'react-native-svg';
import { useTheme } from "styled-components";
import { Picker } from "@react-native-picker/picker";
import { DateTime } from 'luxon'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Toast from "react-native-toast-message";
import axios, { AxiosResponse } from "axios";

import {
    InputEvento,
    ContainerBotoes,
    ContainerIconeLabel,
    ContainerIconeInput,
    ContainerCategoriaTitulo,
    BotaoCategoria,
    ContainerMiniInput,
    BotaoPicker,
    ContainerEncerrado
} from './styles';
import { 
    consultaEnderecoPelaCoordenada, 
    format, 
    formataDuracao, 
    formatarEnderecoGoogle, 
    horaFusoBr, 
    primeiraLetraMaiuscula 
} from "../../functions";
import { 
    Alerta,
    Container, 
    Texto 
} from "../../components";
import { 
    EventoProp, 
    IEventoConsulta 
} from "./interfaceEvento";
import { 
    getIdUsuario, 
    getNomeUsuario 
} from "../../../store/reducerUsuario";
import { Botao } from "../../components/Botao";
import { BotaoPadrao } from "../../components/Botao/styles";
import { ErroRequisicao } from "../../../interface";
import { ICategoria } from "../../interfaces/ICategoria";
import { getLocalizacao } from "../../../store/reducerLocalizacao";
import { ICoordenadas } from "../../interfaces/ICoordenadas";
import { IUsuario } from "../../interfaces/IUsuario";
import { IConvite } from "../../interfaces/IConvite";
import { CHAVE_MAPA } from "@env";
import EventoVisualizacao from "./EventoVisualizacao";
import MapaLocalEvento from "./MapaLocalEvento";

export default function Evento(props: EventoProp) {

    const { cores, textoTamanho } = useTheme();
    const { navigation, route } = props;
    
    const refPicker = useRef<Picker<ICategoria | null>>();
    const idUsuario = useSelector(getIdUsuario);
    const nomeUsuario = useSelector(getNomeUsuario);
    const localizacaoUsuario = useSelector(getLocalizacao);
    const aceitarConvite = route?.params?.aceitarConvite ?? null;

    const [valorEntrada, setValorEntrada] = useState<string | null>(null);
    const [titulo, setTitulo] = useState<string | null>(null);
    const [descricao, setDescricao] = useState<string | null>(null);
    const [duracao, setDuracao] = useState<string | null>(null);
    const [data, setData] = useState<Date | undefined>(
        new Date(new Date().getTime() + (-3 * 60 * 60 * 1000))
    );
    const [hora, setHora] = useState<string | null>(
        horaFusoBr(new Date()).split(':')[0] + ':' +
        horaFusoBr(new Date()).split(':')[1]
    );    
    const [situacaoParticipante, setSituacaoParticipante] = useState({
        solicitado: false,
        participando: false,
        mensagem: '' 
    });
    const [mostrarAlertaRemover, setMostrarAlertaRemover] = useState(false);
    const [localEvento, setLocalEvento] = useState<string | null>(null);
    const [limiteParticipantes, setLimiteParticipantes] = useState<string | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<ICategoria | null>(null);
    const [coordenadasEvento, setCoordenadasEvento] = useState<ICoordenadas | null>(null);
    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [visualizacao, setVisualizacao] = useState(false);    
    const [tecladoAberto, setTecladoAberto] = useState(false);
    const [encerrado, setEncerrado] = useState(false);
    const [carregandoConsulta, setCarregandoConsulta] = useState(false);
    const [carregandoSalvar, setCarregandoSalvar] = useState(false);
    const [carregandoSairEvento, setCarregandoSairEvento] = useState(false);
    const [localizacaoFocado, setLocalizacaoFocado] = useState(false);    
    const [mostrarMapa, setMostrarMapa] = useState(false);
    const [usuarioCriador, setUsuarioCriador] = useState<IUsuario | null>(null);
    const [totalParticipantes, setTotalParticipantes] = useState(0);
    
    async function consultaEvento(id: number) {
     
        setCarregandoConsulta(true);

        try {

            const { data }: AxiosResponse<IEventoConsulta> = await axios.get(`/evento/${id}`);    
            setTitulo(data.evento.nome);
            setDescricao(data.evento.descricao);
            setData(new Date(data.evento.dataHoraInicio));      
            setLocalEvento(data.evento.local);
            setLimiteParticipantes(data.evento.limiteParticipantes.toString());
            setDuracao(data.evento.duracao.split(':').splice(0,2).join(':'));
            setCategoriaSelecionada(data.evento.categoria);
            setValorEntrada(data.evento.valorEntrada ? data.evento.valorEntrada.toString() : null);
            setCategorias(data.categorias);
            setEncerrado(data.evento.encerrado);
            setCoordenadasEvento({
                latitude: data.evento.latitude,
                longitude: data.evento.longitude
            });      
            setHora(
                format(new Date(data.evento.dataHoraInicio)).split(' ')[1].split(':')[0] + ':' +
                format(new Date(data.evento.dataHoraInicio)).split(' ')[1].split(':')[1]
            );      
            setUsuarioCriador(data.usuarioCriador);
            setTotalParticipantes(data.totalParticipantes);
            if(data.evento.idUsuarioCriador !== idUsuario) {
                setVisualizacao(true);
                verificaSituacaoParticipante(data.convitesEvento, data.idsUsuariosParticipantes);
            }
            navigation.setParams({ 
                id,
                contagemParticipante: data.totalParticipantes.toString() 
            });
            
        } catch(error: any) {
            const erro = error as ErroRequisicao;
            console.error(erro?.response ? erro.response : erro);
            if(erro.response && erro.response.data) {
                Toast.show({
                    type: 'error',
                    topOffset: 100,
                    text1: "Erro!",
                    text2: erro.response.data.message,
                    position: 'top'
                });
            } else {
                Alert.alert("Erro!", "Houve um problema. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoConsulta(false);
        }

    }

    async function consultaEnderecoAtual(coordenadasConsulta: ICoordenadas) {

        setCarregandoConsulta(true);

        try {

            const resultadosEnderecos = await consultaEnderecoPelaCoordenada(CHAVE_MAPA!, coordenadasConsulta);
            const enderecoCoordenadas = formatarEnderecoGoogle(resultadosEnderecos.results[1]);
            return {
                endereco: enderecoCoordenadas.endereco,
                latitude: enderecoCoordenadas.coordenadas.lat,
                longitude: enderecoCoordenadas.coordenadas.lng
            }            

        } catch(error: any) {
            const erro = error as ErroRequisicao;
            console.error(erro?.response ? erro.response : erro);
        } finally {
            setCarregandoConsulta(false);
        }

    }
    
    async function consultarCategorias() {

        setCarregandoConsulta(true);

        try {

            const { data }: AxiosResponse<ICategoria[]> = await axios.get('/categoria');
            setCategorias(data);

        } catch(error: any) {
            const erro = error as ErroRequisicao;
            console.error(erro?.response ? erro.response : erro);
            if(erro.response && erro.response.data) {
                Toast.show({
                    type: 'error',
                    topOffset: 100,
                    text1: "Erro!",
                    text2: erro.response.data.message,
                    position: 'top'
                });
            } else {
                Alert.alert("Erro!", "Houve um problema. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoConsulta(false);
        }

    }

    async function enviarSolicitacao() {

        setCarregandoSalvar(true);
        
        try {

            await axios.post('/convite', {
                idEvento: route.params.id!,
                tipo: 'participante_criador',
                descricao: `O usuário ${nomeUsuario} deseja participar do evento ${titulo}`,
                idUsuarioEmissor: idUsuario,
                idUsuarioDestinatario: usuarioCriador!.id
            });
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: `Solicitação enviada ao criador do evento!`,
                position: 'top'
            });
            consultaEvento(route.params.id!);

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
                Alert.alert("Erro!", "Houve um erro ao enviar o convite. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoSalvar(false);
        }

    }
    
    async function salvarEvento(idEvento?: number | null) {

        // pega só a data
        const dt = DateTime.fromJSDate(data!).setZone('UTC').toFormat('yyyy-MM-dd');
        
        setCarregandoSalvar(true);
        
        const parametros = {
            nome: titulo,
            descricao,
            idUsuarioCriador: idUsuario,
            idCategoria: categoriaSelecionada?.id,
            dataHoraInicio: new Date(dt+'T'+hora+':00'+'.000Z'),
            local: localEvento,
            duracao,
            valorEntrada,
            limiteParticipantes,
            latitude: coordenadasEvento?.latitude,
            longitude: coordenadasEvento?.longitude
        } as any;

        const url = idEvento ? `/evento/${idEvento}` : '/evento';
        const axiosMetodo = idEvento ? axios.put : axios.post;
        
        try {

            const { data } = await axiosMetodo(url, {
                ...parametros
            });
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: `Evento ${idEvento ? 'editado' : 'cadastrado'} com sucesso!`,
                position: 'top'
            });                
            consultaEvento(data.id);

        } catch(error: any) {
            const erro = error as ErroRequisicao;
            console.error(erro?.response ? erro.response.data : erro);
            if(erro.response && erro.response.data) {
                Toast.show({
                    type: 'error',
                    topOffset: 100,
                    visibilityTime: 3000,
                    text1: "Erro!",
                    text2: erro.response.data.message,
                    position: 'top'
                });
            } else {
                Alert.alert("Erro!", "Houve um erro ao salvar o evento. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoSalvar(false);
        }

    }

    async function cancelarEvento() {

        setCarregandoSairEvento(true);

        const idEvento = route.params.id!;

        try {

            await axios.delete(`/evento/${idEvento}`);
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: `Evento removido com sucesso!`,
                position: 'top'
            });
            navigation.goBack();

        } catch(error: any) {
            const erro = error as ErroRequisicao;
            console.error(erro?.response ? erro.response.data : erro);
            if(erro.response && erro.response.data) {
                Toast.show({
                    type: 'error',
                    topOffset: 100,
                    visibilityTime: 3000,
                    text1: "Erro!",
                    text2: erro.response.data.message,
                    position: 'top'
                });
            } else {
                Alert.alert("Erro!", "Houve um erro ao remover o evento. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoSairEvento(false);
        }

    }

    async function sairEvento() {
        
        setCarregandoSairEvento(true);

        try {
            
            await axios.post(`/participante/evento/${route.params.id!}`, {
                idUsuario
            });
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: `Saída do evento efetuada com sucesso!`,
                position: 'top'
            });
            navigation.goBack();

        } catch(error: any) {
            const erro = error as ErroRequisicao;
            console.error(erro?.response ? erro.response.data : erro);
            if(erro.response && erro.response.data) {
                Toast.show({
                    type: 'error',
                    topOffset: 100,
                    visibilityTime: 3000,
                    text1: "Erro!",
                    text2: erro.response.data.message,
                    position: 'top'
                });
            } else {
                Alert.alert("Erro!", "Houve um erro ao sair do evento. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoSairEvento(false);
        }

    }

    function verificaSituacaoParticipante(convites: IConvite[], idsUsuariosEvento: number[]) {

        let retornoSituacao = '';
        let solicitado = false;
        let participando = false;
        const idsUsuarioEmissor = convites.map(c => c.idUsuarioEmissor);

        if(idsUsuarioEmissor.length > 0 && idsUsuarioEmissor.includes(idUsuario)) {

            solicitado = true;
            retornoSituacao = 'Solicitação enviada!';

        }

        if(retornoSituacao.length === 0 && idsUsuariosEvento.includes(idUsuario)) {

            participando = true;
            retornoSituacao = "Participando!";

        };
        
        setSituacaoParticipante({
            solicitado,
            participando,
            mensagem: retornoSituacao.length === 0 ? (aceitarConvite ? "Aceitar Convite" : "Enviar Solicitação") : retornoSituacao            
        });

    }
    
    function limpar() {
        setCategoriaSelecionada(null);
        setTitulo(null);
        setDescricao(null);
        setDuracao(null);
        setLocalEvento(null);
        setCoordenadasEvento(null);
        setLimiteParticipantes(null);
        setValorEntrada(null);
    }

    const handleAceitarConvite = async () => {

        setCarregandoSalvar(true);

        if(aceitarConvite) aceitarConvite();

        setCarregandoSalvar(false);

        navigation.goBack();

    }
    
    const resgataData = () => DateTimePickerAndroid.open({
        value: data || new Date(),
        display: 'calendar',
        mode: 'date',
        minimumDate: new Date(),
        onChange(event, date) {
            if(event.type === 'dismissed') return;
            setData(date);                                    
        }
    });
    
    const resgataHora = () => {
        const valor = hora ? 
            new Date(`${data?.toISOString().split('T')[0] + ' ' + hora + ':00'}`) : 
            new Date()
        ;
        DateTimePickerAndroid.open({
            value: valor,
            display: 'clock',
            is24Hour: true,        
            mode: 'time',
            onChange(event, date) {
                if(!date || event.type === 'dismissed') return;
                setHora(
                    date.toLocaleTimeString().split(':')[0] + ':' +
                    date.toLocaleTimeString().split(':')[1]
                );                                    
            }
        })
    };
    
    const resgataDuracao = () => {
        const valor: any = duracao ? 
            new Date(`${data?.toISOString().split('T')[0] + ' ' + duracao + ':00'}`) : 
            new Date(new Date(new Date().setHours(1, 30)))
        ;
        DateTimePickerAndroid.open({
            value: valor,
            display: 'spinner',            
            is24Hour: true,                    
            mode: 'time',
            onChange(event, date) {
                if(!date || event.type === 'dismissed') return;
                setDuracao(
                    date.toLocaleTimeString().split(':')[0] + ':' +
                    date.toLocaleTimeString().split(':')[1]
                );                                    
            }
        })
    }
    
    useEffect(() => {
        if(route.params && route.params.id) {
            consultaEvento(route.params.id);
        } else {
            consultarCategorias();
            if(localizacaoUsuario) {
                async function consultaEndereco() {
                    const retornoEndereco = await consultaEnderecoAtual(localizacaoUsuario);

                    if(retornoEndereco) {
                        setLocalEvento(retornoEndereco.endereco);
                        setCoordenadasEvento({
                            latitude: retornoEndereco.latitude,
                            longitude: retornoEndereco.longitude
                        });
                    }
                }      
                consultaEndereco();             
            }
        }
    }, []);
    
    useEffect(() => {

        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setTecladoAberto(true);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setTecladoAberto(false);
        });
      
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };

    }, []);
    
    return (<>
        {(!mostrarMapa) && <Container>
            {encerrado && <ContainerEncerrado>
                <Texto 
                    style={{ 
                        fontWeight: 'bold', 
                        color: encerrado ? 'red' : 'white', 
                        fontSize: textoTamanho.abaixoNormal 
                    }}
                >
                    {encerrado ? 'Encerrado' : ''}
                </Texto>
            </ContainerEncerrado>}
            {(!encerrado || (encerrado && !visualizacao)) && <ScrollView
                scrollEnabled
                showsVerticalScrollIndicator
                showsHorizontalScrollIndicator={false}
                persistentScrollbar
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ 
                    flexGrow: 1,
                    padding: 10, 
                    paddingBottom: 20,
                    paddingTop: encerrado ? 0 : 10 
                }}
                style={{ 
                    flex: 1, 
                    marginBottom: 15, 
                    marginTop: encerrado ? -10 : 0 
                }}
            >                
                {(!carregandoConsulta || !categorias) ? 
                    <View style={{ flexGrow: 1, gap: 5 }}>
                        {(!visualizacao) ? <>
                            {(tecladoAberto && localizacaoFocado) ? <></> : <ContainerCategoriaTitulo>
                                <BotaoCategoria
                                    style={{
                                        borderWidth: categoriaSelecionada ? 0 : 1,
                                        opacity: encerrado ? 0.5 : 1,
                                        width: categoriaSelecionada ? 80 : 100,
                                        height: categoriaSelecionada ? 80 : 100
                                    }}
                                    onPress={() => {
                                        if(!encerrado) refPicker?.current?.focus();
                                    }}
                                >
                                    {(!categoriaSelecionada) ? 
                                        <Texto
                                            style={{
                                                textAlign: 'center',
                                                fontSize: textoTamanho.muitoPequeno
                                            }}
                                        >
                                            Selecione uma categoria
                                        </Texto> :
                                        <SvgUri 
                                            width={'100%'}
                                            height={'100%'}
                                            uri={categoriaSelecionada.icone}
                                        />
                                    }
                                    <Picker
                                        ref={(ref) => {if(ref) refPicker.current = ref}}
                                        selectedValue={categoriaSelecionada}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setCategoriaSelecionada(itemValue)
                                        }}
                                        mode="dialog"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'none',
                                            color: cores.texto,
                                            marginLeft: -10,
                                        }}        
                                    >
                                        <Picker.Item                                 
                                            key={0}
                                            label={"Selecione uma categoria"}
                                            color={"gray"}
                                            enabled={false}
                                            style={{ 
                                                fontSize: textoTamanho.normal
                                            }}
                                        />
                                        {categorias.map((categoria, index) => (                                
                                            <Picker.Item                                 
                                                key={index + 1}
                                                label={primeiraLetraMaiuscula(categoria.nome)}
                                                value={categoria}
                                                color={"black"}
                                                style={{ 
                                                    fontSize: textoTamanho.normal
                                                }}
                                            />
                                        ))}                            
                                    </Picker>
                                </BotaoCategoria>
                                <InputEvento 
                                    value={titulo ?? ''}
                                    onChangeText={(text) => setTitulo(text)}
                                    placeholder='Título do Evento*'
                                    cursorColor={'black'}
                                    placeholderTextColor={cores.textoOpaco}
                                    textAlign="center"
                                    multiline    
                                    editable={!encerrado}
                                    style={{
                                        flex: 1,
                                        opacity: encerrado ? 0.5 : 1,
                                        color: cores.texto,
                                        maxHeight: 100,
                                        width: 'auto'
                                    }}
                                />
                            </ContainerCategoriaTitulo>}
                            {(tecladoAberto && localizacaoFocado) ? <></> :  <ContainerIconeInput
                                style={{ 
                                    marginTop: -10
                                }}
                            >
                                <ContainerIconeLabel>
                                    <MaterialCommunityIcons 
                                        name="text-box" 
                                        size={24} 
                                        color={cores.texto} 
                                        style={{ lineHeight: 24, marginTop: 1 }}
                                    />
                                    <Texto
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: textoTamanho.abaixoNormal
                                        }}
                                    >
                                        Descrição*
                                    </Texto>
                                </ContainerIconeLabel>
                                <InputEvento 
                                    value={descricao ?? ''}
                                    onChangeText={(text) => setDescricao(text)}
                                    placeholder='Insira uma descrição do evento'
                                    cursorColor={'black'}
                                    placeholderTextColor={cores.textoOpaco}
                                    textAlign="left"       
                                    multiline    
                                    textAlignVertical="top"
                                    editable={!encerrado}
                                    style={{
                                        opacity: encerrado ? 0.5 : 1,
                                    }}
                                />
                            </ContainerIconeInput>}   
                            {(tecladoAberto && localizacaoFocado) ? <></> :  <ContainerIconeInput
                                style={{ 
                                    flexDirection: 'row', 
                                    gap: 5
                                }}
                            >
                                <ContainerMiniInput
                                    style={{
                                        maxWidth: '45%'
                                    }}
                                >
                                    <ContainerIconeLabel
                                        style={{
                                            justifyContent: 'center'
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
                                                fontSize: textoTamanho.abaixoNormal
                                            }}
                                            numberOfLines={1}
                                        >
                                            Data*
                                        </Texto>
                                    </ContainerIconeLabel>
                                    <BotaoPicker
                                        onPress={() => {
                                            if(!encerrado) resgataData();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                color: 'white',
                                                opacity: (encerrado || !data) ? 0.5 : 1,
                                                fontSize: textoTamanho.abaixoNormal
                                            }}
                                        >                                        
                                            {data ? DateTime.fromJSDate(data, {zone: 'UTC'}).toFormat('dd/MM/yyyy') : 'dd/mm/yyyy'}
                                        </Text>
                                    </BotaoPicker>
                                </ContainerMiniInput>
                                <ContainerMiniInput
                                    style={{
                                        maxWidth: '45%'
                                    }}
                                >
                                    <ContainerIconeLabel
                                        style={{ 
                                            width: 'auto',
                                            justifyContent: 'center'
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
                                                fontSize: textoTamanho.abaixoNormal
                                            }}
                                            numberOfLines={1}
                                        >
                                            Hora*
                                        </Texto>
                                    </ContainerIconeLabel>
                                    <BotaoPicker
                                        onPress={() => {
                                            if(!encerrado) resgataHora();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                color: 'white',
                                                opacity: (encerrado || !hora) ? 0.5 : 1,
                                                fontSize: textoTamanho.abaixoNormal
                                            }}
                                        >
                                            {hora || '00:00'}
                                        </Text>
                                    </BotaoPicker>
                                </ContainerMiniInput>                                
                            </ContainerIconeInput>}
                            {(tecladoAberto && localizacaoFocado) ? <></> : <ContainerIconeInput>
                                <ContainerIconeLabel>
                                    <FontAwesome5 
                                        name="hourglass-half" 
                                        size={20} 
                                        color="white" 
                                        style={{ lineHeight: 20, marginTop: 2.5 }}
                                    />
                                    <Texto
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: textoTamanho.abaixoNormal
                                        }}
                                        numberOfLines={1}
                                    >
                                        Duração*
                                    </Texto>
                                </ContainerIconeLabel>
                                <View 
                                    style={{  
                                        width: '100%',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <BotaoPicker
                                        onPress={() => {
                                            if(!encerrado) resgataDuracao();
                                        }}
                                        style={{
                                            maxWidth: 125
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',                                               
                                                opacity: (encerrado || !duracao) ? 0.5 : 1,
                                                fontSize: textoTamanho.abaixoNormal
                                            }}
                                        >
                                            {duracao ? formataDuracao(duracao) : 'Ex: 1h e 30m'}
                                        </Text>
                                    </BotaoPicker>
                                </View>
                            </ContainerIconeInput>}                            
                            <ContainerIconeInput 
                                style={
                                    Object.assign(
                                        localizacaoFocado && tecladoAberto ? {
                                            height: 'auto'
                                        } : 
                                        {},
                                        {
                                            minHeight: 100
                                        }
                                    )
                                }
                            >
                                <ContainerIconeLabel
                                    style={{
                                        marginBottom: 0
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
                                            marginLeft: 2,
                                            fontSize: textoTamanho.abaixoNormal
                                        }}
                                        numberOfLines={1}
                                    >
                                        Local da partida*
                                    </Texto>
                                </ContainerIconeLabel>
                                <GooglePlacesAutocomplete
                                    placeholder={localEvento ?? 'Indique o local da partida'}
                                    onPress={(data, details) => {
                                        if(details) {
                                            const enderecoCoordenada = formatarEnderecoGoogle(details);
                                            setLocalEvento(enderecoCoordenada.endereco);
                                            setCoordenadasEvento({
                                                latitude: enderecoCoordenada.coordenadas.lat,
                                                longitude: enderecoCoordenada.coordenadas.lng
                                            });
                                        }                                    
                                    }}         
                                    enablePoweredByContainer={false}
                                    renderRightButton={() => (
                                        ((localizacaoFocado && tecladoAberto) || encerrado) ? <></> : 
                                        <TouchableOpacity
                                            style={{
                                                opacity: encerrado ? 0.5 : 1,
                                                height: '100%',
                                                width: 30,
                                                justifyContent: 'center'
                                            }}
                                            onPress={() => setMostrarMapa(true)}
                                        >
                                            <FontAwesome5 
                                                name="map-marker-alt" 
                                                size={24} 
                                                color="white" 
                                                style={{ lineHeight: 24, marginTop: 1 }}
                                            />
                                        </TouchableOpacity>
                                    )}
                                    query={{
                                        key: CHAVE_MAPA,
                                        language: 'pt-BR',
                                    }}
                                    nearbyPlacesAPI="GoogleReverseGeocoding"
                                    fetchDetails
                                    keyboardShouldPersistTaps="always"
                                    isRowScrollable
                                    disableScroll
                                    styles={{
                                        textInput: {
                                            paddingLeft: 0,
                                            height: '100%',
                                            textAlign: 'left',
                                            backgroundColor: 'transparent',
                                            borderBottomWidth: 2,               
                                            opacity: encerrado ? 0.5 : 1,   
                                            borderRadius: 0,
                                            borderColor: 'white',
                                            fontSize: textoTamanho.abaixoNormal,
                                            color: cores.texto,
                                            overflow: 'hidden'
                                        },
                                        textInputContainer: {
                                            width: '100%',
                                            height: localizacaoFocado ? 'auto' : '100%',
                                            paddingRight: 5,
                                            gap: 15,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        },
                                        container: {
                                            height: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }
                                    }}
                                    textInputProps={{
                                        selection: !localizacaoFocado ? {
                                            start: 0,
                                            end: 0
                                        } : undefined,
                                        cursorColor: 'black',
                                        editable: !encerrado,
                                        multiline: true,
                                        numberOfLines: 2,
                                        placeholderTextColor: localEvento ? cores.texto : cores.textoOpaco,
                                        onFocus: () => setLocalizacaoFocado(true),
                                        onBlur: () => setLocalizacaoFocado(false)
                                    }}
                                />
                            </ContainerIconeInput>  
                            {(tecladoAberto && localizacaoFocado) ? <></> :  <ContainerIconeInput>
                                <ContainerIconeLabel>
                                    <FontAwesome
                                        name="group" 
                                        size={24} 
                                        color="white" 
                                        style={{ lineHeight: 24, marginTop: 1 }}
                                    />
                                    <Texto
                                        style={{
                                            fontWeight: 'bold',
                                            marginLeft: 2,
                                            fontSize: textoTamanho.abaixoNormal
                                        }}
                                        numberOfLines={1}
                                    >
                                        Limite de Participantes*
                                    </Texto>
                                </ContainerIconeLabel>
                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <InputEvento 
                                        value={limiteParticipantes ?? ''}
                                        onChangeText={(text) => setLimiteParticipantes(text)}
                                        placeholder='Ex: 5'
                                        inputMode="decimal"
                                        cursorColor={'black'}
                                        placeholderTextColor={cores.textoOpaco}
                                        maxLength={3}
                                        editable={!encerrado}
                                        style={{
                                            opacity: encerrado ? 0.5: 1,
                                            width: 100
                                        }}
                                    />
                                </View>
                            </ContainerIconeInput>}   
                            {(tecladoAberto && localizacaoFocado) ? <></> :  <ContainerIconeInput>
                                <ContainerIconeLabel>
                                    <FontAwesome5
                                        name="dollar-sign" 
                                        size={24} 
                                        color="white" 
                                        style={{ lineHeight: 24, marginTop: 1 }}
                                    />
                                    <Texto
                                        style={{
                                            fontWeight: 'bold',
                                            marginLeft: 2,
                                            fontSize: textoTamanho.abaixoNormal
                                        }}
                                        numberOfLines={1}
                                    >
                                        Valor da Entrada
                                    </Texto>
                                </ContainerIconeLabel>
                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <InputEvento 
                                        value={valorEntrada ?? ''}
                                        onChangeText={(text) => setValorEntrada(text)}
                                        placeholder='Ex: 3,50'
                                        inputMode="decimal"
                                        cursorColor={'black'}
                                        placeholderTextColor={cores.textoOpaco}
                                        maxLength={6}
                                        editable={!encerrado}
                                        style={{
                                            opacity: encerrado ? 0.5 : 1,
                                            width: 100
                                        }}
                                    />
                                </View>
                            </ContainerIconeInput>}       
                        </> : <EventoVisualizacao 
                            categoriaSelecionada={categoriaSelecionada!}
                            cores={cores}
                            textoTamanho={textoTamanho}
                            titulo={titulo ?? ''}
                            descricao={descricao ?? ''}
                            localEvento={localEvento ?? ''}
                            valorEntrada={valorEntrada}
                            usuarioCriador={usuarioCriador!}
                            duracao={duracao!}
                            data={DateTime.fromJSDate(data!, {zone: 'UTC'}).toFormat('dd/MM/yyyy')}
                            hora={hora!}
                            totalParticipantes={totalParticipantes}
                            limiteParticipantes={limiteParticipantes!}
                        />}
                    </View> :
                    <ActivityIndicator 
                        size={50}
                        color={'black'}
                    />
                }                  
            </ScrollView>}
            {(encerrado || tecladoAberto) ? <></> :
                <ContainerBotoes>
                    {(
                        visualizacao && 
                        (!situacaoParticipante.participando)
                    ) ? <></> : <BotaoPadrao
                        style={{ 
                            backgroundColor: (visualizacao || route.params?.id) ? cores.cancelar : 'transparent',
                            borderColor: (visualizacao || route.params?.id) ? 'transparent' : 'white',
                            borderWidth: (visualizacao || route.params?.id) ? 0 : 1,
                            width: '48%',
                            elevation: (visualizacao || route.params?.id) ? 4 : 0
                        }}
                        onPress={() => {
                            (visualizacao) ? sairEvento() : (
                                route.params?.id ? 
                                    setMostrarAlertaRemover(true) : 
                                    limpar()
                            );
                        }}
                    >
                        {(!carregandoSairEvento) ? <Texto
                            style={{
                                fontWeight: 'bold',
                                fontSize: textoTamanho.abaixoNormal
                            }}
                        >
                            {visualizacao ? 'Sair' : (route.params?.id ? 'Cancelar' : 'Limpar')}
                        </Texto> :
                            <ActivityIndicator 
                                size={24}
                                color={'white'}
                            />
                        }
                    </BotaoPadrao>}
                    <Botao
                        onClick={() => {
                            if(!carregandoSalvar) {
                                if(!visualizacao) {
                                    salvarEvento((route.params && route.params.id) ? route.params.id : null);
                                } else {
                                    if(situacaoParticipante.participando || situacaoParticipante.solicitado) return;
                                    if(aceitarConvite) return handleAceitarConvite();
                                    enviarSolicitacao();
                                }                                
                            }
                        }}
                        style={{ 
                            backgroundColor: (situacaoParticipante.participando || situacaoParticipante.solicitado) ? 'transparent' : cores.confirmar, 
                            width: visualizacao && (!situacaoParticipante.participando) ? '100%' : '48%'
                        }}
                        props={{
                            activeOpacity: (situacaoParticipante.participando || situacaoParticipante.solicitado) ? 1 : 0.5
                        }}
                        semSombra={situacaoParticipante.participando || situacaoParticipante.solicitado}
                    >
                        {(!carregandoSalvar) ? 
                            <Texto
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: textoTamanho.abaixoNormal
                                }}
                            >
                                {visualizacao ? situacaoParticipante.mensagem : (route.params?.id) ? 'Editar' : 'Salvar'}
                            </Texto> :
                            <ActivityIndicator 
                                size={24}
                                color={'white'}
                            />
                        }
                    </Botao>
                </ContainerBotoes>
            }
        </Container>}
        {(mostrarMapa) && <MapaLocalEvento 
            cores={cores}
            encerrado={encerrado}
            localEvento={localEvento}
            setLocalEvento={setLocalEvento}
            setMostrarMapa={setMostrarMapa}
            coordenadasEvento={coordenadasEvento ?? localizacaoUsuario}
            setCoordenadasEvento={setCoordenadasEvento}
            consultaEnderecoAtual={consultaEnderecoAtual}
        />}
        {(mostrarAlertaRemover) && <Alerta 
            titulo={"Cancelar evento"}
            mensagem={"Você deseja cancelar o evento?"}            
            textoCancelar={"Não"}
            textoConfirmar={"Sim"}
            fechar={() => setMostrarAlertaRemover(false)}
            botaoConfirmar={() => {
                setMostrarAlertaRemover(false);
                cancelarEvento();
            }}
        />} 
    </>);

}