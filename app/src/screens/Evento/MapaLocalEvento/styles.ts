import styled from "styled-components/native";

export const ContainerMapaLocalEvento = styled.View`
    flex-grow: 1;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    position: relative;
`;

export const ContainerInputLocalTexto = styled.View`
    position: absolute;
    top: 20px;
    left: 10px;
    right: 10px;
    z-index: 5;
`;

export const ContainerTextoInput = styled.View`
    width: 100%;
    padding: 10px;
    border-width: 1px;
    border-color: black;
    border-radius: 5px;
    gap: 5px;
    background-color: white;
`;

export const ContainerBotao = styled.View`
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 5;
`;

export const BotaoConfirmaLocal = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    width: 70px;
    height: 70px;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
    background-color: ${props => (props?.theme?.cores?.confirmar)};
`;