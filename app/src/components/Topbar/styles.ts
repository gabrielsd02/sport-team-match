import styled from "styled-components/native";

export const ContainerTopbar = styled.View`
    height: 50px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${props => (props?.theme?.cores?.topbar ?? 'white')};
`;

export const TextoTopbar = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: white;
`;