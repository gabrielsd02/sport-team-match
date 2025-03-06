import styled from "styled-components/native";

export const ContainerValor = styled.View`
    padding: 10px;
    gap: 5px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    border-radius: 3px;
    overflow: hidden;
    background-color: rgba(20, 69, 121, 0.5);
`;

export const ContainerValores = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const TextoValor = styled.Text`
    color: white;
    flex: 1;    
    font-size: ${props => (props?.theme?.textoTamanho?.quasePequeno) + 'px'};
`;

export const LabelTexto = styled.Text.attrs({
    numberOfLines: 1
})`
    font-weight: bold;
    margin-left: 5px;
    color: ${props => (props?.theme?.cores?.texto)};
    font-size: ${props => (props?.theme?.textoTamanho?.abaixoNormal) + 'px'};
`;

export const ContainerTitulo = styled.View`
    height: 120px;
    padding: 10px;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: 3px;
    overflow: hidden;
    background-color: rgba(20, 69, 121, 0.5);
`;