import styled from "styled-components/native";

export const ContainerParticipante = styled.Pressable`
    background-color: ${props => (props?.theme?.cores?.topbar)};
    border-radius: 3px;
    width: 95%;      
    padding: 10px;   
    max-width: 500px;
    gap: 15px;
    min-height: 200px;
    align-items: center;
    overflow: hidden;    
`;

export const FundoPressionavel = styled.Pressable`
    background-color: ${props => (props?.theme?.cores?.fundoModal)};
    flex-grow: 1;
    z-index: 0;
    align-items: center;
    justify-content: center;
`;

export const ContainerDadosUsuario = styled.View`
    width: 95%;
    gap: 10px;
    align-items: center;
    justify-content: center;
`;

export const ContainerImagem = styled.View`
    width: 120px;
    height: 120px;
    background-color: white;
    border-radius: 100px;
    align-items: center;
    justify-content: center;
`;

export const ContainerIconeTexto = styled.View`
    flex-direction: row;
    gap: 5px;
    width: 100%;
`;

export const InputDado = styled.TextInput`
    color: white;
    overflow: hidden;
    border-bottom-width: 2px;
    padding-left: 5px;
    padding-bottom: 5px;
    width: 100%;
    font-size: 20px;
    border-color: rgba(255, 255, 255, 0.5);
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

export const ContainerNota = styled.View`
    width: 95%;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
`;

export const ContainerBotoes = styled.View`
    width: 95%;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
`;