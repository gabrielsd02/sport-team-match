import styled from "styled-components/native";

export const ContainerLogo = styled.View`
    height: 25%;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export const ContainerBotoes = styled.View`
    flex-grow: 1;
    margin: 10px 0px;
    padding: 5px;
    gap: 10px;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
`;

export const ContainerBotoesOpcoes = styled.View`
    width: 100%;
    align-items: center;
    flex-direction: row;
    max-width: 500px;
    justify-content: space-between;
`;

export const BotaoOpcao = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    width: 49%;
    height: 170px;
    overflow: hidden;
    align-items: center;
    position: relative;
    justify-content: space-between;
    padding: 10px;
    gap: 5px;
    border-radius: 10px;
    background-color: ${props => props.theme.cores.fundoCorForte};
`;

export const ContainerIcone = styled.View`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

export const TextoOpcao = styled.Text.attrs({
    numberOfLines: 2
})`
    width: 100%;
    letter-spacing: -0.8px;
    min-height: 30px;
    color: ${props => props.theme.cores.texto};
    text-align: center;
    font-weight: bold;
    font-size: 19px;
`;

export const ContainerRodape = styled.View`
    position: absolute;
    bottom: 10px;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export const ContainerCarregamento = styled.View`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`;

export const ContainerNumeroConvites = styled.View`
    position: absolute;
    top: 10px;
    right: 20px;
    border-radius: 50px;
    width: 35px;
    height: 35px;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.cores.cancelar};
`;

export const TextoNumeroConvites = styled.Text`
    color: ${props => props.theme.cores.texto};
    font-weight: bold;
    font-size: ${props => props.theme.textoTamanho.normal+'px'};
`;