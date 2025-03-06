import styled from 'styled-components/native';

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
    gap: 50px;
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

export const BotaoAdicaoParticipante = styled.TouchableOpacity.attrs({
    activeOpacity: 0.5
})`
    border-radius: 50px;
    width: 60px; 
    height: 60px; 
    align-items: center;
    justify-content: center;
    background-color: ${props => (props?.theme?.cores?.confirmar)};
`;