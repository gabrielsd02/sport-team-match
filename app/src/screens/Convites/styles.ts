import { styled } from "styled-components/native";

export const ContainerLista = styled.View`
    flex-grow: 1; 
    width: 100%; 
    padding: 10px 0px;
`;

export const ContainerRodape = styled.View`
    width: 100%; 
    align-items: center; 
    justify-content: space-between; 
    margin-bottom: 15px; 
    flex-direction: row; 
    padding: 0px 10px; 
`;

export const ContainerPaginacao = styled.View`
    flex-grow: 1;
    height: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const BotaoPaginacao = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    height: 50px;
    width: 50px;
    border-width: 1px;
    border-color: white;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
`;