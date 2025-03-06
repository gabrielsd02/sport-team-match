import styled from "styled-components/native";

export const ContainerIconeInput = styled.View`
    width: 100%;
    overflow: hidden;
    gap: 10px;
    margin-bottom: 15px;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
`;

export const ContainerIconeLabel = styled.View`
    width: 100%;
    gap: 5px;
    height: 24px;
    margin-bottom: 10px;
    flex-direction: row;
    align-items: center;
`;

export const InputEvento = styled.TextInput`
    overflow: hidden;
    border-bottom-width: 2px;
    padding-bottom: 5px;
    width: 100%;
    border-color: white;
    color: ${props => (props?.theme?.cores?.texto)};
    font-size: ${props => (props?.theme?.textoTamanho?.abaixoNormal) + 'px'};
`;

export const ContainerBotoes = styled.View`
    width: 100%; 
    align-items: center; 
    justify-content: space-between;
    flex-direction: row; 
    margin: 10px 0px;
`;

export const ContainerCategoriaTitulo = styled.View`
    width: 100%;
    flex-direction: row;
    gap: 15px;
    margin-bottom: 5px;
    height: 120px;
    overflow: hidden;
    align-items: center;
    justify-content: space-between;
`;

export const BotaoCategoria = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    border-radius: 50px;
    border-color: white;
    align-items: center;
    justify-content: center;
`;

export const BotaoPicker = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    border-bottom-color: white;
    padding-bottom: 5px;
    border-bottom-width: 2px;
    width: 100%;
`;

export const ContainerMiniInput = styled.View`
    overflow: hidden;
    gap: 10px;          
    flex: 1;
    margin-right: 5px;
    justify-content: space-between;
`;

export const ContainerEncerrado = styled.View`
    margin-top: 10px;
    width: 100%;
    padding: 0px 10px;
    align-items: flex-end;
`;