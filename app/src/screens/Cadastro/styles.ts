import styled from "styled-components/native";

export const ContainerFormulario = styled.View`
    width: 100%;
    height: 100%;
    padding: 10px;
    gap: 15px;
`;

export const ContainerFotoNome = styled.View`
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 15px;
    flex-direction: row;
    padding: 10px 0px;
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
`;

export const ContainerBotoesCadastro = styled.View`
    width: 100%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
`;

export const BotaoCadastro = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    width: 100%;
    height: 50px;
    border-radius: 5px;
    background-color: white;
    gap: 10px;
    align-items: center;
    flex-direction: row;
    justify-content: center;
`;

export const BotaoPicker = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    flex: 1;
    margin-right: 5px;
`;

export const BotaoEdicaoFoto = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    width: 30px;
    height: 30px;
    background-color: gray;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0px;
    bottom: -5px;
`;

export const BotaoImagem = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    border-radius: 50px;
    height: 100px;
    width: 100px;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: ${props => props.theme.cores.texto};
`;