import styled from "styled-components/native";
import { StatusBar, Platform, Dimensions } from 'react-native';

const alturaBarra = Platform.OS === 'android' ? StatusBar.currentHeight : 30;
const alturaTela = Dimensions.get('screen').height;
const alturaJanela = Dimensions.get('window').height;
const alturaBotoesNavegacao = alturaTela - alturaJanela + (StatusBar?.currentHeight || 30);

export const ContainerComponente = styled.View`
    width: 100%;
    height: 100%;
    margin-bottom: ${alturaBotoesNavegacao+'px'};
    overflow: hidden;    
    flex-direction: column;
    padding: 5px 10px;
    background-color: ${props => (props?.theme?.cores?.fundo)};
`;