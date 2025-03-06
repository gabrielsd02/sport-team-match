import { Image } from "expo-image";
import styled from "styled-components/native";

export const ContainerItemConvite = styled.TouchableOpacity`
    gap: 5px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    height: 120px;
    overflow: hidden;
    background-color: rgba(20, 69, 121, 0.5);
`;

export const BotaoImagem = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    height: 85px;
    width: 85px;
    margin-left: 10px;
    background-color: white;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
`;

export const ImagemUsuarioEmissor = styled(Image).attrs({
    contentFit: "cover",
    contentPosition: 'center'
})`
    width: 100%;
    flex-grow: 1;
    border-radius: 50px;
`;

export const ContainerTextoEmissao = styled.View`
    flex: 1;
    gap: 5px;
    margin: 10px;
`;

export const ContainerDescricao = styled.View`
    flex: 1;
    width: 100%;
    overflow: hidden;
    justify-content: flex-end;
`;

export const TextoDescricao = styled.Text.attrs({
    numberOfLines: 4
})`
    color: ${props => (props?.theme?.cores?.texto)};
    margin-bottom: 5px;
`;

export const TextoDataCadastro = styled.Text`
    color: ${props => (props?.theme?.cores?.texto)};
    text-align: right;
    width: 100%;
    font-size: 11px;
`;

export const ContainerBotoes = styled.View`
    width: 100%;
    height: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const BotaoOpcao = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    flex: 1;
    height: 100%;
    align-items: center;
    justify-content: center;
`;

export const BotaoOpcaoNegar = styled(BotaoOpcao)`
    border-bottom-left-radius: 3px;
    background-color: #fd536a;
`;

export const BotaoOpcaoAceitar = styled(BotaoOpcao)`
    border-bottom-right-radius: 3px;
    background-color: #008b8b;
`;

export const TextoBotao = styled.Text`
    color: ${props => (props?.theme?.cores?.texto)};
    font-size: ${props => (props?.theme?.textoTamanho?.quasePequeno)+'px'};
    font-weight: bold;
`;