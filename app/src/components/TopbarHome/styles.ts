import { Image } from "expo-image";
import styled from "styled-components/native";

export const ContainerTitulo = styled.View`
    flex: 1;
    margin-right: 80px;
    align-items: flex-start;
    overflow: hidden;
`;

export const Titulo = styled.Text`
    text-align: left;
    font-weight: bold;
    color: white;
    width: 100%;
    font-size: 20px;
`;

export const BotaoIconeFoto = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    background-color: white;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
`;

export const ImagemFoto = styled(Image).attrs({
    contentFit: "cover",
    contentPosition: 'center'
})`
    width: 100%;
    flex-grow: 1;
    border-radius: 50px;
`;