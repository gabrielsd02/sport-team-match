import styled from "styled-components/native";
import { Image } from 'expo-image';

export const ContainerLogin = styled.View`
    flex: 1;
    gap: 5px;
    align-items: center;
`;

export const ContainerLogo = styled.View`
    width: 100%;
    min-height: 25%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
`;

export const ContainerMensagem = styled.View`
    width: 100%;
    margin-top: 10px;
    min-height: 32%;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    position: relative;
`;

export const ImagemFundo = styled(Image).attrs({
    contentFit: 'cover'
})`
    width: 100%;
    height: 100%; 
    max-width: 500px;
    justify-content: center;
    position: absolute;
    top: -90px; 
    opacity: 0.15;
`;

export const ContainerInputs = styled.View`
    width: 85%;
    max-width: 350px;
    flex-grow: 1;
    margin-top: 10px;
    gap: 25px;
    justify-content: center;
    align-items: center;
`;

export const ContainerIconeInput = styled.View`
    width: 100%;
    align-items: center;
    flex-direction: row;
    height: 50px;
    padding: 0px 10px;
    justify-content: flex-start;
    overflow: hidden;
    gap: 10px;
    border-bottom-width: 2px;
    border-bottom-color: ${props => props.theme.cores.textoLogin};
`;

export const ContainerIcone = styled.View`
    height: 100%;
    align-items: center;
    justify-content: flex-end;
`;

export const ContainerLembrarSenha = styled.View`
    width: 100%;
    margin-top: -10px;
    align-items: flex-end;
    justify-content: flex-end;
`;

export const ContainerBotoes = styled.View`
    width: 100%;
    min-height: 30%;
    flex-grow: 1;
    justify-content: flex-start;
    align-items: center;
`;

export const ContainerBotoesLogin = styled.View`
    width: 100%;
    gap: 10px;
    justify-content: center;
    align-items: center;
`;

export const BotaoLogin = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    width: 85%;
    max-width: 350px;
    border-radius: 5px;
    position: relative;
    height: 50px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const BotaIrCadastrar = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    flex-grow: 1;
    margin: 5px 0px;
    align-items: center;
    justify-content: center;
`;