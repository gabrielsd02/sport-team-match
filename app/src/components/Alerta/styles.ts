import styled from "styled-components/native";

export const FundoPressionavel = styled.Pressable`
    background-color: ${props => (props?.theme?.cores?.fundoModal)};
    flex-grow: 1;
    z-index: 0;
    align-items: center;
    justify-content: center;
`;

export const ContainerAlerta = styled.Pressable`
    background-color: ${props => (props?.theme?.cores?.topbar)};
    border-radius: 10px;
    width: 90%;         
    max-width: 500px;
    gap: 10px;
    overflow: hidden;    
`;

export const ContainerTitulo = styled.View`
    width: 100%;
    padding: 10px 15px;
    align-items: flex-start;
    justify-content: center;
    min-height: 30px;
    background-color: ${props => (props?.theme?.cores?.fundoCorForte)};
`;

export const TituloAlerta = styled.Text`
    width: 100%;
    font-weight: bold;
    color: ${props => (props?.theme?.cores?.texto)};
`;

export const ContainerMensagem = styled.View`
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    min-height: 30px;
    padding: 10px 15px;
`;

export const TextoMensagem = styled.Text`
    color: ${props => (props?.theme?.cores?.texto)};
    text-align: left;
`;

export const ContainerBotoes = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
`;

export const BotaoAlerta = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    padding: 10px;
    min-width: 80px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
`;