import { memo } from "react";
import { FontAwesome5 } from '@expo/vector-icons'; 

import { BotaoIcone } from "./styles";
import { IBotaoOpcaoTopo } from './interfaceBotaoOpcao';

function BotaoOpcaoTopo({
    icone,
    size,
    style,
    onClick
}: IBotaoOpcaoTopo) {

    return (
        <BotaoIcone
            onPress={onClick}
            style={style ?? {}}
        >
            <FontAwesome5 
                name={icone}
                size={size} 
                color="white" 
            />
        </BotaoIcone>
    )

}

export default memo(BotaoOpcaoTopo);