import React, { 
	useEffect, 
	useState 
} from "react";
import { 
	useDispatch, 
	useSelector 
} from "react-redux";
import { 
	Alert, 
	Linking, 
	View
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from "styled-components";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import Constants from "expo-constants";
import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';

import {
	setUsuario,
	getFotoUsuario,
	getNomeUsuario,
	getTokenUsuario,
	logoutUsuario
} from '../../store/reducerUsuario'
import { 
	TituloTopoHome, 
	IconeTopoHome
} from "../components/TopbarHome";
import { 
	BotaoOpcaoTopo, 
	BotaoVoltar 
} from "../components";
import { setLocalizacao } from '../../store/reducerLocalizacao'
import { IUsuario } from "../interfaces/IUsuario";
import { IRotas } from "./interfaceRotas";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from "../screens/Home";
import Perfil from "../screens/Perfil";
import RecuperacaoSenha from "../screens/RecuperacaoSenha";
import ListaEventos from "../screens/ListaEventos";
import Evento from "../screens/Evento";
import Convites from "../screens/Convites";
import BotaoOpcaoTopoEvento from "../components/BotaoOpcaoTopoEvento";
import ListaParticipantes from "../screens/ListaParticipantes";
import ListaUsuarios from "../screens/ListaUsuarios";
import MapaEventos from "../screens/MapaEventos";

export default function Routes() {
	
	const { cores } = useTheme();
	const { manifest } = Constants;
	const token = useSelector(getTokenUsuario);
	const [fontsLoaded, fontError] = useFonts({
		'Inter-Medium': require('./../assets/fonts/Inter-Medium.ttf'),
	});

	const nomeUsuario = useSelector(getNomeUsuario);
	const fotoUsuario = useSelector(getFotoUsuario);
	const dispatch = useDispatch();
	const Stack = createNativeStackNavigator<IRotas>();

	const [checando, setChecando] = useState(false);
    
	const estaAutenticado = token && token.length > 0 ? true : false;	
	
	async function verificaCacheLogin() {

		setChecando(true);

		try {

			await SplashScreen.preventAutoHideAsync();

            // consulta usuario no cache
			const usuarioLogado = await AsyncStorage.getItem("@sport-team-match:usuario");
			
            // se está logado
			if(usuarioLogado) {

                // adiciona ao contexto
				const usuario: IUsuario = JSON.parse(usuarioLogado);
				axios.defaults.headers.common['Authorization'] = usuario.token;
				dispatch(
                    setUsuario({
                        ...usuario
                    })
				);

			} else {

				dispatch(logoutUsuario());

			}

		} catch(e) {
			console.error(e);
		} finally {
			setChecando(false);			
		}

	}

	async function obterLocalizacao() {

		// pergunta permissão
		const { status } = await Location.requestForegroundPermissionsAsync();
		
		// caso foi negado
		if (status !== 'granted') {

			// cria alerta
			Alert.alert(
				'Permissão necessária',
				'Para a utilização do app, por favor, aceite a permissão da localização.',
				[
					{
						text: 'Ir para configurações',
						onPress: async () => {

							// vai para a configuração do app                       
							Linking.openSettings();          

						}
					}
				]
			);
			return;

		}
		
		// resgata localização atual do usuário
		const location = await Location.getCurrentPositionAsync({});
		dispatch(setLocalizacao(location.coords));

	}

	useEffect(() => {

		verificaCacheLogin();
		obterLocalizacao();

		// o objeto do manifest, serve para resgatar o ip da máquina que está rodando o aplicativo
		// somente assim para conseguir se conectar ao localhost do back-end na maquina
		axios.defaults.baseURL = __DEV__ ? `http://${manifest?.debuggerHost?.split(':').shift() || 'localhost'}:3000/api` : 'http://54.94.186.45:3000/api';
		axios.defaults.headers.post['Content-Type'] = 'application/json';		

	}, []);
	
	useEffect(() => {
		async function verificacaoSplash() {
			if (!checando && (fontsLoaded || fontError)) {
				await SplashScreen.hideAsync();
			}
		}
		verificacaoSplash();
	}, [checando, fontsLoaded, fontError]);
	
    return (
		<>
			<StatusBar 
				style="light"
				translucent
			/>
			{(!checando && (fontsLoaded || fontError)) ? (
				<Stack.Navigator 
					screenOptions={{ 
						headerShown: estaAutenticado, 
						headerShadowVisible: true,
						headerStyle: {
							backgroundColor: cores.topbar							
						},
						headerTitleStyle: {
							color: 'white',
							fontSize: 24
						}
					}}
				>				
					{
						estaAutenticado 
							? (
								<>
									<Stack.Screen 
										name="Home" 
										component={Home} 
										options={({ navigation }) => ({										
											headerTitle: () => (
												<TituloTopoHome 
													texto={`Bem vindo(a), ${nomeUsuario ?? 'Usuário'}`}
												/>
											),
											headerTitleAlign: 'left',
											headerRight: () => (
												<IconeTopoHome 
													fotoUsuario={fotoUsuario}
													navigation={navigation}
												/>
											)
										})}
									/>
									<Stack.Screen 
										name="Perfil"
										component={Perfil}
										options={({ navigation }) => ({ 
											headerShown: true,
											title: "Meu Perfil",
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>,
											headerRight: () => <BotaoOpcaoTopo 
												icone="sign-out-alt"
												size={32}
												onClick={() => navigation.setParams({ mostrarModalSair: true })}
											/>
										})}
									/>
									<Stack.Screen 
										name="ListaEventos"
										component={ListaEventos}
										options={({ navigation, route }) => ({ 
											title: route.params?.eventosUsuario ? 'Meus Eventos' : "Eventos",
											headerShown: true,
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>,
											headerRight: () => <BotaoOpcaoTopo 
												icone="filter"
												size={28}
												onClick={() => navigation.setParams({ mostrarFiltros: true })}
												style={{
													marginTop: 5
												}}												
											/>
										})}
									/>
									<Stack.Screen 
										name="Evento"
										component={Evento}
										options={({ navigation, route }) => ({ 
											title: 'Evento',
											headerShown: true,
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>,
											headerRight: () => (
												route.params?.id &&
												route.params?.contagemParticipante &&
												parseInt(route.params?.contagemParticipante) > 0
											) ? <BotaoOpcaoTopoEvento 
												icone="group"
												size={32}
												textoContagem={route.params?.contagemParticipante}
												onClick={() => navigation.navigate('ListaParticipantesEvento',{
													idEvento: route.params?.id
												})}
											/> : <></>
										})}
									/>
									<Stack.Screen 
										name="ListaParticipantesEvento"
										component={ListaParticipantes}
										options={({ navigation, route }) => ({ 
											title: "Participantes",
											headerShown: true,
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>
										})}
									/>
									<Stack.Screen 
										name="ListaUsuarios"
										component={ListaUsuarios}
										options={({ navigation, route }) => ({ 
											title: "Encontrar Participantes",
											headerShown: true,
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>
										})}
									/>
									<Stack.Screen 
										name="Convites"
										component={Convites}
										options={({ navigation }) => ({ 
											title: 'Convites',
											headerShown: true,
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>
										})}
									/>
									<Stack.Screen 
										name="MapaEventos"
										component={MapaEventos}
										options={({ navigation }) => ({ 
											title: 'Eventos no Mapa',
											headerShown: true,
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>
										})}
									/>
								</>
							) : (
								<>
									<Stack.Screen 
										name='Login' 
										component={Login} 
									/>
									<Stack.Screen 
										name='Cadastro' 
										component={Cadastro} 
										options={({ navigation }) => ({ 
											headerShown: true,
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>
										})}
									/>
									<Stack.Screen 
										name={'RecuperacaoSenha'}
										component={RecuperacaoSenha} 
										options={({ navigation }) => ({ 
											title: 'Recuperar Senha',
											headerShown: true,
											headerTitleAlign: 'center',
											headerLeft: () => <BotaoVoltar 
												navigation={navigation}
											/>
										})}
									/>									
									
								</>
							)
					}			
				</Stack.Navigator> 
			) : <></>}
		</>
    )    

}