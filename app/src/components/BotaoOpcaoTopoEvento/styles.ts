import styled from "styled-components/native";

export const BotaoIcone = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    position: relative;
    align-items: center;
    justify-content: center;
`;

export const ContainerContagem = styled.View`
    position: absolute;
    left: -8px;
    bottom: -8px;
    background-color: white;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50px;
    justify-content: center;
    z-index: 10;
`;

export const TextoContagem = styled.Text`
    font-size: 12px;
    font-weight: bold;
`;