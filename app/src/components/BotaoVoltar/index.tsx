import { memo } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { FontAwesome5 } from '@expo/vector-icons'; 

import { BotaoIcone } from './styles'
import { IRotas } from "../../routes/interfaceRotas";

interface IBotaoVoltar {
    navigation: StackNavigationProp<IRotas>;
}

export function BotaoVoltar({
    navigation
}: IBotaoVoltar) {

    return (
        <BotaoIcone
            onPress={() => {
                if(navigation.canGoBack()) navigation.goBack()
            }}
        >
            <FontAwesome5 
                name="arrow-circle-left" 
                size={38} 
                color="white" 
            />
        </BotaoIcone>
    )

}

export default memo(BotaoVoltar);