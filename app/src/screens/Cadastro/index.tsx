import React, { 
    useState, 
    useRef 
} from "react";
import { 
    Alert,
    TextInput,
    ScrollView, 
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { 
    FontAwesome, 
    Ionicons,
    Entypo,
    FontAwesome5, 
    MaterialIcons
} from '@expo/vector-icons'; 
import { Picker } from '@react-native-picker/picker';
import { useTheme } from "styled-components";
import { Image } from 'expo-image'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";
import Toast from 'react-native-toast-message';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';

import {
    BotaoPicker,
    BotaoImagem,
    BotaoCadastro,
    ContainerIcone,
    BotaoEdicaoFoto,
    ContainerFotoNome,
    ContainerIconeInput,
    ContainerFormulario,
    ContainerBotoesCadastro
} from './styles';
import { 
    Container, 
    Texto 
} from "../../components";
import { ErroRequisicao } from "../../../interface";
import { IUsuario } from "../../interfaces/IUsuario";
import { setUsuario } from "../../../store/reducerUsuario";
import { generos } from "../../utils/variaveis";

export default function Cadastro() {

    const { 
        cores, 
        textoTamanho 
    } = useTheme();
    const dispatch = useDispatch();
    
    const refPicker = useRef<Picker<string | null>>();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregandoCadastro, setCarregandoCadastro] = useState(false);
    const [dataNascimento, setDataNascimento] = useState<Date | undefined>();
    const [sexo, setSexo] = useState<string | null>('M');
    const [foto, setFoto] = useState<string | null>(null);

    async function cadastrar() {
        
        setCarregandoCadastro(true);        
        
        try {

            if(
                (confirmarSenha !== senha) || 
                confirmarSenha === '' || 
                senha === ''
            ) {
                throw {
                    response: {
                        data: {
                            message: "A senha e a confirmação de senha não coincidem."
                        }
                    }
                };
            }

            const parametros = {
                nome,
                email,
                telefone, 
                senha,
                dataNascimento,
                sexo,
                foto
            }
            
            const { data }: AxiosResponse<IUsuario> = await axios
                .post('/usuario/cadastro', parametros)
            ;
            await AsyncStorage.setItem("@sport-team-match:usuario", JSON.stringify(data));            
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: "Cadastro realizado com sucesso!",
                position: 'top'
            });
            axios.defaults.headers.common['Authorization'] = data.token;
            dispatch(setUsuario(data));            
            
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
                Alert.alert("Erro!", "Houve um erro ao cadastrar. Verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoCadastro(false);
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
    
    return (                
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
                <ContainerFormulario>                
                    <ContainerFotoNome> 
                        <BotaoImagem
                            style={{
                                padding: foto ? 0 : 10
                            }}
                            activeOpacity={!foto ? 0.5 : 1}
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
                                        borderRadius: 50
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
                                        size={20}
                                        color={'white'}
                                    /> :
                                    <FontAwesome 
                                        name="close"
                                        size={20}
                                        color={'white'}
                                    />
                                }
                            </BotaoEdicaoFoto>
                        </BotaoImagem>
                        <TextInput 
                            value={nome}
                            onChangeText={(text) => setNome(text)}
                            placeholder='Nome*'
                            cursorColor={'black'}
                            verticalAlign='middle'
                            placeholderTextColor={cores.textoOpaco}
                            numberOfLines={1}                                                            
                            style={{
                                flex: 1,
                                textAlign: 'left',
                                fontSize: textoTamanho.normal,
                                borderBottomWidth: 2,
                                borderBottomColor: cores.texto,
                                color: cores.texto,
                                paddingBottom: 5,
                                paddingHorizontal: 5
                            }}
                        />
                    </ContainerFotoNome>
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
                            value={telefone}
                            onChangeText={(text) => setTelefone(text)}
                            placeholder='Telefone'
                            cursorColor={'black'}
                            inputMode="tel"
                            verticalAlign='middle'
                            placeholderTextColor={cores.textoOpaco}
                            numberOfLines={1}                                                            
                            style={{
                                flex: 1,
                                marginRight: 5,
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
                                    style={{ 
                                        fontSize: textoTamanho.normal
                                    }}
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
                                {dataNascimento?.toLocaleDateString('pt-BR') || 'Data de nascimento'}
                            </Texto>
                        </BotaoPicker>
                    </ContainerIconeInput>
                    <ContainerIconeInput>        
                        <ContainerIcone>
                            <Entypo
                                name="lock" 
                                size={26} 
                                color={cores.texto} 
                            />            
                        </ContainerIcone>
                        <TextInput 
                            value={senha}
                            placeholder='Senha'
                            placeholderTextColor={cores.textoOpaco}
                            cursorColor={'black'}
                            onChangeText={(text) => setSenha(text)}
                            secureTextEntry={!mostrarSenha}
                            verticalAlign='middle'
                            numberOfLines={1}                            
                            style={{
                                flex: 1,
                                marginRight: 5,
                                fontSize: textoTamanho.normal,
                                color: cores.texto
                            }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => setMostrarSenha(!mostrarSenha)}
                            style={{marginTop: 5}}
                        >
                            <FontAwesome 
                                name={mostrarSenha ? "eye-slash" : "eye"} 
                                size={26} 
                                color={cores.texto} 
                            />  
                        </TouchableOpacity>
                    </ContainerIconeInput>
                    <ContainerIconeInput>          
                        <ContainerIcone>
                            <Entypo
                                name="lock" 
                                size={26} 
                                color={cores.texto} 
                            />         
                        </ContainerIcone>        
                        <TextInput 
                            value={confirmarSenha}
                            onChangeText={(text) => setConfirmarSenha(text)}
                            placeholder='Confirme a senha*'
                            placeholderTextColor={cores.textoOpaco}
                            secureTextEntry
                            cursorColor={'black'}
                            verticalAlign='middle'
                            numberOfLines={1}                                                            
                            style={{
                                flex: 1,
                                marginRight: 5,
                                fontSize: textoTamanho.normal,
                                color: cores.texto
                            }}
                        />
                    </ContainerIconeInput>
                    <ContainerBotoesCadastro>
                        <BotaoCadastro
                            style={{
                                backgroundColor: '#11468F',
                                elevation: 4
                            }}
                            onPress={cadastrar}
                        >
                            {(!carregandoCadastro) ? 
                                <Texto
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 'bold'
                                    }}
                                    sombra={false}
                                >
                                    Cadastrar
                                </Texto> :
                                <ActivityIndicator 
                                    size={30}
                                    color="white"
                                />
                            }
                        </BotaoCadastro>                                                
                    </ContainerBotoesCadastro>  
                </ContainerFormulario>
            </ScrollView>
        </Container>
    );

} 