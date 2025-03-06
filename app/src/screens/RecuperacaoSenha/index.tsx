import { 
    useEffect, 
    useState 
} from 'react';
import { 
    View, 
    TextInput, 
    Alert, 
    ActivityIndicator, 
    TouchableOpacity
} from 'react-native';
import { 
    Feather,
    FontAwesome, 
    Entypo,
    AntDesign
} from '@expo/vector-icons'; 
import { useTheme } from "styled-components";
import { useURL } from 'expo-linking';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Constants from "expo-constants";

import { 
    Container, 
    Texto 
} from "../../components";
import { 
    ContainerBotao,
    ContainerIcone, 
    ContainerIconeInput 
} from './styles';
import { Botao } from '../../components/Botao';
import { ErroRequisicao } from '../../../interface';

export default function RecuperacaoSenha() {

    const urlRedirecionada = useURL();
    const { manifest } = Constants;
    const { cores, textoTamanho } = useTheme();
    const navigation = useNavigation();

    const [id, setId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [senha, setSenha] = useState<string | null>(null);
    const [confirmarSenha, setConfirmarSenha] = useState<string | null>(null);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [codigoValidado, setCodigoValidado] = useState(false);
    const [codigo, setCodigo] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    // const linkApp = __DEV__ ? `exp://${manifest?.debuggerHost}/--/RecuperacaoSenha` : `${manifest?.scheme}://RecuperacaoSenha`;
    
    async function enviarEmail() {

        setCarregando(true);        

        try {

            const { data } = await axios.post(`/usuario/redefinicao`, {
                email
            });
            setId(data.id);
            setCodigoValidado(false);

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
                Alert.alert("Erro!", "Houve um erro ao realizar o login. Por favor, verifique sua conexão com a internet.");
            }
        } finally {
            setCarregando(false);
        }

    }

    async function verificarCodigo() {

        setCarregando(true);

        try {

            await axios.post(`/usuario/codigo-redefinicao/${id}`, {
                codigo
            });
            setCodigoValidado(true);

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
                Alert.alert("Erro!", "Houve um erro ao verificar o código. Por favor, verifique sua conexão com a internet.");
            }
        } finally {
            setCarregando(false);
        }

    }

    async function redefinirSenha() {

        setCarregando(true);

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

            await axios.post(`/usuario/redefinicao/${id}`, {
                senha
            });
            setEmail(null);
            setId(null);
            Toast.show({
                type: 'success',
                topOffset: 100,
                text1: "Sucesso!",
                text2: "Sua senha foi alterada com sucesso!",
                position: 'top'
            });
            navigation.goBack();

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
                Alert.alert("Erro!", "Houve um erro ao realizar o login. Por favor, verifique sua conexão com a internet.");
            }
        } finally {
            setCarregando(false);
        }

    }
    
    return (
        <Container
            style={{
                marginTop: 0,
                marginBottom: 0,
                flexGrow: 1
            }}
        >
            <View 
                style={{ 
                    flex: 1, 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: 10, 
                    gap: 15 
                }}
            >
                <Texto 
                    style={{ 
                        fontWeight: 'bold', 
                        fontSize: 22 
                    }} 
                    numberOfLines={2}
                >
                    {id ? (codigoValidado ? 'Redefinição de sua senha:' : 'Insira o código que foi enviado ao seu email') : 'Insira seu email para redefinir sua senha: '}
                </Texto>
                <ContainerIconeInput>          
                    <ContainerIcone 
                        style={{ 
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 8
                        }}
                    >
                        <Feather
                            name="mail" 
                            size={26} 
                            color={cores.textoLogin}
                        />    
                    </ContainerIcone>       
                    <TextInput 
                        value={email ?? ''}
                        onChangeText={(text) => setEmail(text)}
                        editable={!id}
                        placeholder='Email'
                        verticalAlign='middle'
                        cursorColor={'black'}
                        autoComplete='email'
                        inputMode='email'
                        placeholderTextColor={cores.textoLoginOpaco}
                        numberOfLines={1}                                                            
                        style={{
                            flex: 1,
                            marginRight: 5,
                            marginTop: 5,
                            fontSize: textoTamanho.normal,
                            color: cores.textoLogin
                        }}
                    />
                </ContainerIconeInput>
                {(id && codigoValidado) ? <>
                    <ContainerIconeInput>           
                        <ContainerIcone 
                            style={{
                                justifyContent: 'center',
                                marginTop: 1
                            }}
                        >
                            <AntDesign 
                                name="lock" 
                                size={28} 
                                color={cores.textoLogin} 
                            />       
                        </ContainerIcone>      
                        <TextInput 
                            value={senha ?? ''}
                            placeholder='Nova Senha'
                            onChangeText={(text) => setSenha(text)}
                            secureTextEntry={!mostrarSenha}
                            verticalAlign='middle'
                            cursorColor={'black'}
                            placeholderTextColor={cores.textoLoginOpaco}
                            numberOfLines={1}                            
                            style={{
                                flex: 1,
                                marginRight: 5,
                                fontSize: textoTamanho.normal,
                                color: cores.textoLogin
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
                                color={cores.textoLogin} 
                            />  
                        </TouchableOpacity>
                    </ContainerIconeInput>
                    <ContainerIconeInput>          
                        <ContainerIcone 
                            style={{
                                justifyContent: 'center',
                                marginTop: 1
                            }}
                        >
                            <AntDesign 
                                name="lock" 
                                size={28} 
                                color={cores.textoLogin} 
                            />       
                        </ContainerIcone>      
                        <TextInput 
                            value={confirmarSenha ?? ''}
                            onChangeText={(text) => setConfirmarSenha(text)}
                            placeholder='Confirme a senha'
                            secureTextEntry
                            verticalAlign='middle'
                            cursorColor={'black'}
                            placeholderTextColor={cores.textoLoginOpaco}
                            numberOfLines={1}                                                            
                            style={{
                                flex: 1,
                                marginRight: 5,
                                fontSize: textoTamanho.normal,
                                color: cores.textoLogin
                            }}
                        />
                    </ContainerIconeInput>
                </> : (id && !codigoValidado) ? <ContainerIconeInput>          
                    <ContainerIcone 
                        style={{
                            justifyContent: 'center',
                            marginTop: 5
                        }}
                    >
                        <AntDesign 
                            name="lock" 
                            size={28} 
                            color={cores.textoLogin} 
                        />       
                    </ContainerIcone>            
                    <TextInput 
                        value={codigo ?? ''}
                        onChangeText={(text) => setCodigo(text)}
                        placeholder='Código'
                        verticalAlign='middle'
                        cursorColor={'black'}
                        placeholderTextColor={cores.textoLoginOpaco}
                        numberOfLines={1}                                                            
                        style={{
                            flex: 1,
                            marginRight: 5,
                            marginTop: 5,
                            fontSize: textoTamanho.normal,
                            color: cores.textoLogin
                        }}
                    />
                </ContainerIconeInput> : <></>}
                <ContainerBotao>
                    <Botao
                        onClick={() => {
                            if(!id) return enviarEmail();
                            if(id && !codigoValidado) return verificarCodigo();
                            if(id && codigoValidado) redefinirSenha();
                        }}
                    >
                        {!carregando ? 
                            <Texto
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold'
                                }}
                                sombra={false}
                            >
                                {id ? 'Redefinir' : 'Enviar'}
                            </Texto> : 
                            <ActivityIndicator 
                                size={30}
                                color="white"
                            />
                        }
                    </Botao>
                </ContainerBotao>
            </View>
        </Container>
    );

}