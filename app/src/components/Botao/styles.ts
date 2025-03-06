import styled from "styled-components/native";

export const BotaoPadrao = styled.TouchableOpacity`
    width: 100%;
    height: 50px;
    border-radius: 5px;
    background-color: ${props => (props?.theme?.cores?.fundoCorForte ?? 'white')};
    align-items: center;
    flex-direction: row;
    justify-content: center;
`;