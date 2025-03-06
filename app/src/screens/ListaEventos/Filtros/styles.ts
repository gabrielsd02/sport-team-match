import styled from "styled-components/native";

export const FundoPressionavel = styled.Pressable`
    background-color: ${props => (props?.theme?.cores?.fundoModal)};
    flex-grow: 1;
    z-index: 0;
    align-items: center;
    justify-content: center;
`;

export const ContainerLabelFiltro = styled.View`
    width: 100%;
    margin-top: 5px;
    justify-content: center;
`;

export const BotaoFiltro = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    width: 100%;
    align-items: center;
    border-width: 1px;
    margin-bottom: 5px;
    flex-direction: row;
    border-color: white;
    border-radius: 5px;
    padding: 10px;
`;

export const ContainerDataHora = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const ContainerTextoData = styled.View`
    width: 47%;
    gap: 10px;
    align-items: center;
    justify-content: center;
`;

export const BotaoData = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    width: 100%;
    align-items: center;
    justify-content: center;
    border-width: 1px;
    margin-bottom: 5px;
    padding: 10px;
    border-color: white;
    border-radius: 5px;
`;

export const ContainerFiltros = styled.Pressable`
    background-color: ${props => (props?.theme?.cores?.topbar)};
    border-radius: 3px;
    width: 90%;      
    padding: 10px;   
    max-width: 500px;
    gap: 10px;
    min-height: 200px;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;    
`;

export const BotaoFechar = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    padding: 12px;
    width: 120px;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.cores.cancelar};
    border-radius: 10px;
`;

export const BotaoSalvar = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    padding: 12px;
    width: 120px;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.cores.confirmar};
    border-radius: 10px;
`;

export const ContainerBotoes = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
`;