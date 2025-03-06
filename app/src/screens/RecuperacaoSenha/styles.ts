import styled from "styled-components/native";

export const ContainerIconeInput = styled.View`
    width: 100%;
    align-items: center;
    flex-direction: row;
    height: 50px;
    padding: 0px 10px;
    justify-content: flex-start;
    overflow: hidden;
    gap: 10px;
    border-bottom-width: 2px;
    border-bottom-color: ${props => props.theme.cores.textoLogin};
`;

export const ContainerIcone = styled.View`
    height: 100%;
    align-items: center;
    justify-content: flex-end;
`;

export const ContainerBotao = styled.View`
    height: 100px; 
    align-items: center; 
    justify-content: flex-end; 
    width: 100%;
`;