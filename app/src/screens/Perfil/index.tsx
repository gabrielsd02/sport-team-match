import { 
    useRef,
    useState, 
    useCallback, 
    useEffect
} from "react";
import { 
    useSelector,
    useDispatch 
} from "react-redux";
import { 
    ScrollView, 
    View,
    TextInput,
    ActivityIndicator,
    Alert,
    TouchableOpacity
} from "react-native";
import { 
    FontAwesome, 
    Ionicons,
    MaterialIcons,
    FontAwesome5
} from '@expo/vector-icons'; 
import { useFocusEffect } from "@react-navigation/native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useTheme } from "styled-components";
import { Image } from "expo-image";
import { Picker } from "@react-native-picker/picker";
import { DateTime } from "luxon";
import axios, { AxiosResponse } from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';

import { 
    Alerta,
    Container, 
    Texto 
} from "../../components";
import { 
    getIdUsuario, 
    getTokenUsuario, 
    logoutUsuario, 
    setUsuario
} from "../../../store/reducerUsuario";
import { 
    BotaoFoto,
    BotaoPicker,
    ContainerFoto,
    ContainerIcone, 
    BotaoEdicaoFoto,
    ContainerInputs,
    ContainerIconeInput,
    ContainerBotaoSalvar
} from "./styles";
import { ErroRequisicao } from "../../../interface";
import { BotaoPadrao } from "../../components/Botao/styles";
import { IUsuarioInfo } from "../../interfaces/IUsuario";
import { PerfilProps } from './interfacePerfil';
import { generos } from "../../utils/variaveis";

export default function Perfil({
    navigation,
    route
}: PerfilProps) {
    
    const { cores, textoTamanho } = useTheme();
    const idUsuario = useSelector(getIdUsuario);
    const token = useSelector(getTokenUsuario);
    const dispatch = useDispatch();
    const refPicker = useRef<Picker<string | null>>();
    const [carregandoConsulta, setCarregandoConsulta] = useState(false);
    const [carregandoSalvar, setCarregandoSalvar] = useState(false);
    const [mostrarSair, setMostrarSair] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState<Date | undefined>();
    const [telefone, setTelefone] = useState<string | null>(null);
    const [sexo, setSexo] = useState<string | null>('M');
    const [foto, setFoto] = useState<string | null>(null);
    
    async function consultarUsuario() {

        setCarregandoConsulta(true);
        
        try {
            
            const { data }: AxiosResponse<IUsuarioInfo> = await axios.get(`/usuario/${idUsuario}`); 
            setNome(data.nome);
            setEmail(data.email);
            setTelefone(data.telefone);
            setDataNascimento(new Date(new Date(data.dataNascimento).setUTCHours(3)));
            setSexo(data.sexo);
            setFoto(data.foto);
        } catch(e: any) {
            const error = e as ErroRequisicao;
            console.error(error.response);
        } finally {
            setCarregandoConsulta(false);
        }

    }
    
    async function salvar() {
        
        setCarregandoSalvar(true);

        try {

            // atualiza dados do usuário
            const { data }: AxiosResponse<IUsuarioInfo> = await axios.put(`/usuario/${idUsuario}`, {
                nome, 
                email, 
                telefone, 
                dataNascimento: DateTime.fromJSDate(dataNascimento!).toISO(), 
                sexo, 
                foto
            }); 

            // altera no cache
            await AsyncStorage.setItem("@sport-team-match:usuario", JSON.stringify({
                ...data,
                token
            }));

            // altera dados no contexto
            dispatch(setUsuario({
                ...data,
                token
            }));

            // altera informações
            setNome(data.nome);
            setEmail(data.email);
            setTelefone(data.telefone);            
            setDataNascimento(new Date(new Date(data.dataNascimento).setUTCHours(3)));
            setSexo(data.sexo);
            setFoto(data.foto);

            // apresenta toast
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: "Edição realizada com sucesso!",
                position: 'top'
            });

        } catch(e: any) {
            const erro = e as ErroRequisicao;
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
                Alert.alert("Erro!", "Houve um erro ao editar :( Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoSalvar(false);
        }

    }

    async function resgatarFotoDispotivo() {

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            base64: true,
            allowsMultipleSelection: false
        });
        
        if(!resultado.canceled) {
            const imagem64 = 'data:image/jpeg;base64,' + resultado.assets[0].base64;
            setFoto(imagem64);
        }

    }

    const resgataData = () => DateTimePickerAndroid.open({
        value: dataNascimento || new Date(),
        display: 'calendar',
        mode: 'date',
        onChange(event, date) {
            if(event.type === 'dismissed') return;
            if(date) setDataNascimento(new Date(date.setHours(6)));
        }
    });

    useFocusEffect(
        useCallback(() => {
            consultarUsuario();
        }, [])
    );

    useEffect(() => {
        setMostrarSair(route.params?.mostrarModalSair ?? false);
    }, [route.params]);
    
    return (<>        
        <Container
            style={{
                marginTop: 0,
                marginBottom: 0,
                flexGrow: 1
            }}
        >
            <ScrollView
                scrollEnabled
                showsVerticalScrollIndicator
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {(!carregandoConsulta) ? 
                    <>
                        <ContainerFoto>
                            <BotaoFoto
                                onPress={resgatarFotoDispotivo}
                            >
                                {(!foto) ?
                                    <FontAwesome5 
                                        name={'user'}
                                        color={'gray'}
                                        size={60}              
                                    /> :
                                    <Image 
                                        source={foto}
                                        contentFit="cover"
                                        contentPosition={'center'}
                                        style={{
                                            width: '100%',
                                            flexGrow: 1,
                                            borderRadius: 100
                                        }}
                                    />
                                }
                                <BotaoEdicaoFoto
                                    activeOpacity={foto ? 0.5 : 1}
                                    onPress={() => {
                                        if(!foto) return;
                                        setFoto(null);
                                    }}
                                >
                                    {(!foto) ? 
                                        <MaterialIcons 
                                            name="edit"
                                            size={25}
                                            color={'white'}
                                        /> :
                                        <FontAwesome 
                                            name="close"
                                            size={25}
                                            color={'white'}
                                        />
                                    }
                                </BotaoEdicaoFoto>
                            </BotaoFoto>
                        </ContainerFoto>
                        <ContainerInputs>
                            <ContainerIconeInput>     
                                <ContainerIcone>      
                                    <FontAwesome
                                        name="user" 
                                        size={26} 
                                        color={cores.texto}
                                    />       
                                </ContainerIcone>          
                                <TextInput 
                                    value={nome}
                                    onChangeText={(text) => setNome(text)}
                                    placeholder='Nome*'
                                    verticalAlign='middle'
                                    cursorColor={'black'}
                                    placeholderTextColor={cores.textoOpaco}
                                    numberOfLines={1}                                                            
                                    style={{
                                        flex: 1,
                                        height: '100%',
                                        marginRight: 5,
                                        fontSize: textoTamanho.normal,
                                        color: cores.texto
                                    }}
                                />
                            </ContainerIconeInput>
                            <ContainerIconeInput>     
                                <ContainerIcone>      
                                    <Ionicons
                                        name="mail" 
                                        size={26} 
                                        color={cores.texto}
                                    />       
                                </ContainerIcone>          
                                <TextInput 
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                    placeholder='Email*'
                                    cursorColor={'black'}
                                    inputMode="email"
                                    verticalAlign='middle'
                                    placeholderTextColor={cores.textoOpaco}
                                    numberOfLines={1}                                                            
                                    style={{
                                        flex: 1,
                                        height: '100%',
                                        marginRight: 5,
                                        fontSize: textoTamanho.normal,
                                        color: cores.texto
                                    }}
                                />
                            </ContainerIconeInput>
                            <ContainerIconeInput>       
                                <ContainerIcone>
                                    <FontAwesome5
                                        name="phone-alt" 
                                        size={24} 
                                        color={cores.texto} 
                                    />                 
                                </ContainerIcone>
                                <TextInput 
                                    value={telefone ?? ''}
                                    onChangeText={(text) => setTelefone(text)}
                                    placeholder='Telefone'
                                    inputMode="tel"
                                    cursorColor={'black'}
                                    verticalAlign='middle'
                                    placeholderTextColor={cores.textoOpaco}
                                    numberOfLines={1}                                                            
                                    style={{
                                        flex: 1,
                                        marginRight: 5,
                                        height: '100%',
                                        fontSize: textoTamanho.normal,
                                        color: cores.texto
                                    }}
                                />                            
                            </ContainerIconeInput>
                            <ContainerIconeInput>           
                                <ContainerIcone>
                                    <FontAwesome5
                                        name="transgender" 
                                        size={26} 
                                        color={cores.texto}                                 
                                    />         
                                </ContainerIcone>        
                                <BotaoPicker
                                    onPress={() => refPicker?.current?.focus()}
                                >
                                    <Texto
                                        style={{                                    
                                            fontSize: textoTamanho.normal,
                                            color: sexo ? cores.texto : cores.textoOpaco
                                        }}
                                    >
                                        {sexo ? (sexo.toUpperCase() === 'M' ? "Masculino" : "Feminino") : 'Sexo'}
                                    </Texto>
                                </BotaoPicker>
                                <Picker
                                    ref={(ref) => {if(ref) refPicker.current = ref}}
                                    selectedValue={sexo}
                                    onValueChange={(itemValue, itemIndex) => setSexo(itemValue)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'none',
                                        color: cores.texto,
                                        marginLeft: -10,
                                    }}        
                                >
                                    {generos.map((genero, index) => (                                
                                        <Picker.Item                                 
                                            key={index}
                                            label={genero.label}
                                            value={genero.value}
                                            color={"black"}
                                            style={{ fontSize: textoTamanho.normal }}
                                        />
                                    ))}                            
                                </Picker>
                            </ContainerIconeInput>
                            <ContainerIconeInput>      
                                <ContainerIcone>
                                    <Ionicons
                                        name="calendar" 
                                        size={26} 
                                        color={cores.texto} 
                                    />              
                                </ContainerIcone>   
                                <BotaoPicker
                                    onPress={resgataData}
                                >
                                    <Texto
                                        style={{                                    
                                            fontSize: textoTamanho.normal,
                                            color: dataNascimento ? cores.texto : cores.textoOpaco
                                        }}
                                    >
                                        {dataNascimento?.toLocaleDateString('pt-BR') ?? 'Data de nascimento'}
                                    </Texto>
                                </BotaoPicker>
                            </ContainerIconeInput>
                            <ContainerBotaoSalvar>
                                <BotaoPadrao
                                    onPress={salvar}
                                    style={{ 
                                        backgroundColor: cores.confirmar,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 12,
                                        },
                                        shadowOpacity: 0.58,
                                        shadowRadius: 16.00,                                        
                                        elevation: 24,
                                    }}
                                >
                                    {(!carregandoSalvar) ? 
                                        <Texto
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold'
                                            }}
                                            sombra={false}
                                        >
                                            Salvar
                                        </Texto> :
                                        <ActivityIndicator 
                                            size={30}
                                            color="white"
                                        /> 
                                    }
                                </BotaoPadrao> 
                            </ContainerBotaoSalvar>
                        </ContainerInputs> 
                    </> :
                    <ActivityIndicator 
                        size={50}
                        color={'black'}
                    />
                }                
            </ScrollView>
        </Container>
        {mostrarSair && <Alerta 
            fechar={() => navigation.setParams({ mostrarModalSair: false })}
            titulo="Sair"
            mensagem={"Você deseja encerrar sua sessão no app?"}
            textoConfirmar="Encerrar"
            botaoConfirmar={() => dispatch(logoutUsuario())}
        />}
    </>);

}