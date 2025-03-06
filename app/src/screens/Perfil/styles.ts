import styled from "styled-components/native";

export const ContainerFoto = styled.View`
    width: 100%;
    align-items: center;
    justify-content: center;
    margin: 10px 0px;
`;

export const ContainerInputs = styled.View`
    gap: 15px;
    width: 100%;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
    padding: 10px;
`;

export const BotaoFoto = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    border-radius: 100px;
    height: 130px;
    width: 130px;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: ${props => props.theme.cores.texto};
`;

export const ContainerIconeInput = styled.View`
    width: 100%;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    height: 50px;
    overflow: hidden;
    border-bottom-width: 2px;
    padding: 0px 10px;
    border-bottom-color: ${props => props.theme.cores.texto};
`;

export const ContainerIcone = styled.View`
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 100%;
`;

export const BotaoPicker = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    flex: 1;
    margin-right: 5px;
`;

export const ContainerBotaoSalvar = styled.View`
    flex-grow: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export const BotaoEdicaoFoto = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    background-color: gray;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0px;
    bottom: -5px;
`;