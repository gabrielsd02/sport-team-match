import { Animated } from "react-native";
import styled from "styled-components/native";

export const ContainerItem = styled(Animated.View)`
    width: 100%;
    margin: 5px 0px; 
    padding: 10px; 
    overflow: hidden;
    border-radius: 5px;
    border-width: 2px;
    border-color: black;
`;

export const BotaoItem = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    flex: 1;
    overflow: hidden;
`;

export const ContainerTopbarItem = styled.View`
    width: 100%; 
    align-items: center; 
    justify-content: center; 
    position: relative; 
    overflow: hidden; 
    margin-bottom: 5px;
`;

export const ContainerTituloTextos = styled.View`
    flex-direction: row; 
    align-items: center; 
    position: relative;
    justify-content: center;
`;

export const ContainerTitulo = styled.View`
    flex: 1; 
    align-items: center; 
    justify-content: center; 
    border-bottom-width: 2px; 
    border-bottom-color: black;
`;

export const ContainerDadosEvento = styled.View`
    flex: 1; 
    flex-direction: row; 
    align-items: center; 
    gap: 5px;
`;

export const ContainerIconeCategoria = styled.View`
    height: 100%; 
    align-items: center; 
    justify-content: center;
`;

export const ContainerInformacoesEvento = styled.View`
    flex: 1; 
    align-items: center; 
    justify-content: center; 
    padding-right: 5px; 
    gap: 2px;
`;

export const ContainerBotaoExpandir = styled.View`
    width: 40px; 
    height: 100%;
`;

export const ContainerDescricao = styled.View`
    width: 100%; 
    margin-top: 2px;
`;

export const TextoDescricao = styled.Text.attrs({
    numberOfLines: 2
})`
    width: 100%;
    text-align: left;
    font-size: 12px;
`;

export const ContainerDados = styled.View`
    width: 100%; 
    align-items: center; 
    justify-content: space-between; 
    flex-direction: row;
`;

export const ContainerIconeTexto = styled.View`
    gap: 5px; 
    flex-direction: row; 
    align-items: center; 
    justify-content: center;
`;

export const ContainerIconeDado = styled.View`
    width: 20px; 
    align-items: center; 
    justify-content: center;
`;

export const BotaoExpandir = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    margin-right: 5px; 
    flex-grow: 1; 
    width: 100%; 
    align-items: flex-end; 
    justify-content: center;
`;

export const ContainerStatusEvento = styled.View`
    height: 100%;
    margin-right: 5px;
    width: 70px;
`;

export const TextoParticipando = styled.Text`
    background-color: black;
    border-radius: 3px;
    padding: 1px 0px;
    line-height: 13px;
    color: orange;
    text-align: center;
    font-size: 10px;
    font-weight: bold;
`;