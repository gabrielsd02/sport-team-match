import styled from "styled-components/native";

export const TextoComponente = styled.Text`
    color: ${props => (props?.theme?.cores?.text ?? 'white')};
`;