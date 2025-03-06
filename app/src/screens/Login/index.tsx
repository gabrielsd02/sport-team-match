import { 
    useEffect, 
    useState 
} from 'react';
import { 
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { 
    Feather,
    FontAwesome, 
    AntDesign
} from '@expo/vector-icons'; 
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';

import {
    Container,
    Texto
} from '../../components';
import { 
    GoogleIcone, 
    Logo
} from '../../utils/icones';
import {
    BotaoLogin,
    ImagemFundo,
    ContainerLogo,
    ContainerLogin,
    ContainerIcone,
    ContainerInputs,
    BotaIrCadastrar,
    ContainerBotoes,
    ContainerMensagem,
    ContainerIconeInput,
    ContainerBotoesLogin,
    ContainerLembrarSenha
} from './styles'
import { WEB_CLIENT_FIREBASE } from '@env';
import { IRotas } from '../../routes/interfaceRotas';
import { IUsuario } from '../../interfaces/IUsuario';
import { setUsuario } from '../../../store/reducerUsuario';
import { ErroRequisicao } from '../../../interface';
import Imagem from '../../assets/images/imagem-fundo-login-2.png';

type LoginScreenProp = StackNavigationProp<IRotas, 'Login'>;

export default function Login() {

    GoogleSignin.configure({
        webClientId: WEB_CLIENT_FIREBASE
    });    
    
    const { cores, textoTamanho } = useTheme();
    const navigation = useNavigation<LoginScreenProp>();
    const dispatch = useDispatch();
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregandoCadastro, setCarregandoCadastro] = useState(false);
    const [carregandoGoogle, setCarregandoGoogle] = useState(false);
    
    async function login() {

        setCarregandoCadastro(true);

        const parametros = {
            email,
            senha
        };

        try {

            const { data }: AxiosResponse<IUsuario> = await axios
                .post('/usuario/login', parametros)
            ;
            await AsyncStorage.setItem("@sport-team-match:usuario", JSON.stringify(data));
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
                Alert.alert("Erro!", "Houve um erro ao realizar o login. Por favor, verifique sua conexão com a internet.");
            }
        } finally {
            setCarregandoCadastro(false);
        }

    }

    async function loginGoogleServidor(emailGoogle: string) {

        try {

            const { data }: AxiosResponse<IUsuario> = await axios.post(`/usuario/login/${emailGoogle}`);
            await AsyncStorage.setItem("@sport-team-match:usuario", JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = data.token;
            dispatch(setUsuario(data));
            
        } catch(e) {
            throw e;
        }

    }

    async function loginGoogleFirebase() {

        setCarregandoGoogle(true);

        try {

            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            const dadosUsuarioLogadoGoogle = await auth().signInWithCredential(googleCredential);
            
            // loga com o usuario
            await loginGoogleServidor(dadosUsuarioLogadoGoogle.user.email!);

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
            setCarregandoGoogle(false);
        }

    }
    
    return (
        <Container>
            <ContainerLogin>            
                <ContainerLogo>
                    <Logo 
                        width={320}
                        height={50}
                    />
                </ContainerLogo>
                <ContainerMensagem>
                    <ImagemFundo 
                        source={Imagem}
                    />
                    <Texto
                        style={{ 
                            color: cores.textoLogin,
                            fontWeight: 'bold',
                            fontSize: textoTamanho.titulo                            
                        }}
                    >
                        Bem-vindo(a) de volta!
                    </Texto>
                    <ContainerInputs>
                        <ContainerIconeInput>          
                            <ContainerIcone 
                                style={{ marginBottom: 12 }}
                            >
                                <Feather
                                    name="mail" 
                                    size={26} 
                                    color={cores.textoLogin}
                                />    
                            </ContainerIcone>       
                            <TextInput 
                                value={email}
                                onChangeText={(text) => setEmail(text)}
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
                                value={senha}
                                placeholder='Senha'
                                cursorColor={'black'}
                                onChangeText={(text) => setSenha(text)}
                                secureTextEntry={!mostrarSenha}
                                verticalAlign='middle'
                                onEndEditing={login}
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
                        <ContainerLembrarSenha>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigation.navigate('RecuperacaoSenha')}
                            >
                                <Texto 
                                    style={{
                                        textDecorationLine: 'underline',
                                        color: cores.textoLogin
                                    }}
                                >
                                    Esqueceu sua senha?
                                </Texto>
                            </TouchableOpacity>
                        </ContainerLembrarSenha>
                    </ContainerInputs>                    
                </ContainerMensagem>
                <ContainerBotoes>
                    <ContainerBotoesLogin>
                        <BotaoLogin
                            style={{
                                backgroundColor: '#11468F',
                                shadowColor: '#000',
                                elevation: 4,
                            }}
                            activeOpacity={0.5}
                            onPress={login}
                        >
                            {(!carregandoCadastro) ? 
                                <Texto
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 'bold'
                                    }}
                                    sombra={false}
                                >
                                    Entrar
                                </Texto> :
                                <ActivityIndicator 
                                    size={30}
                                    color="white"
                                />
                            }
                        </BotaoLogin>    
                        <Texto
                            style={{
                                fontWeight: 'bold',
                                fontSize: 18
                            }}
                        >
                            Ou
                        </Texto>  
                        <BotaoLogin
                            style={{
                                backgroundColor: 'white',
                                shadowColor: '#000',
                                elevation: 4
                            }}
                            activeOpacity={0.5}
                            onPress={() => loginGoogleFirebase()}
                        >
                            <View
                                style={{
                                    position: 'absolute',
                                    left: 10
                                }}
                            >
                                <GoogleIcone 
                                    height={30}
                                    width={30}
                                />                                
                            </View>                            
                            {(!carregandoGoogle) ? 
                                <Texto
                                    style={{
                                        fontSize: 18,
                                        marginLeft: 15,
                                        textAlign: 'center',
                                        fontWeight: 'bold', 
                                        color: 'black'
                                    }}
                                    sombra={false}
                                >  
                                Entrar com o Google
                                </Texto> :
                                <ActivityIndicator 
                                    size={30}
                                    color="black"
                                />
                            }
                        </BotaoLogin>                                              
                    </ContainerBotoesLogin>                   
                    <BotaIrCadastrar
                        onPress={() => navigation.navigate('Cadastro')}
                    >                        
                        <Texto
                            style={{
                                textDecorationLine: 'underline',
                                fontSize: 18,
                                color: cores.textoLogin
                            }}
                        >   
                            Cadastre-se
                        </Texto>                            
                    </BotaIrCadastrar>
                </ContainerBotoes>
            </ContainerLogin>
        </Container>
    );

}