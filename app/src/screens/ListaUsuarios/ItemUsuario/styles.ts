import { Image } from "expo-image";
import styled from "styled-components/native";

export const ContainerItemUsuario = styled.View`
    height: 140px;
    gap: 5px;
    align-items: center;
    margin-bottom: 15px;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    border-radius: 3px;
    overflow: hidden;
    background-color: rgba(20, 69, 121, 0.5);
`;

export const BotaoImagem = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    height: 80px;
    width: 80px;
    margin-left: 10px;
    background-color: white;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
`;

export const ImagemUsuario = styled(Image).attrs({
    contentFit: "cover",
    contentPosition: 'center'
})`
    width: 100%;
    flex-grow: 1;
    border-radius: 50px;
`;

export const ContainerDadosUsuario = styled.View`
    flex: 1;
    height: 100%;
    gap: 2px;
    padding: 10px 5px;
`;

export const NomeUsuario = styled.Text.attrs({
    numberOfLines: 1
})`
    width: 100%;
    font-weight: bold;
    border-bottom-width: 2px;
    margin-bottom: 2px;
    border-bottom-color: white;
    color: ${props => (props?.theme?.cores?.texto)};
    font-size: ${props => (props?.theme?.textoTamanho?.medio)+'px'};
`;

export const ContainerIconeTextoUsuario = styled.View`
    width: 100%;
    gap: 5px;
    flex-direction: row;
    align-items: center;
`;

export const ContainerIcone = styled.View`
    height: 20px;
    width: 20px;
    align-items: center;
    justify-content: center;
`;

export const TextoDadoUsuario = styled.Text`
    color: ${props => (props?.theme?.cores?.texto)};
    font-size: ${props => (props?.theme?.textoTamanho?.quasePequeno)+'px'};
`;

export const BotaoConvidar = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    width: 50px;
    height: 100%;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: #008b8b;
`;