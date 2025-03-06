import { memo } from "react";
import { FontAwesome } from '@expo/vector-icons'; 

import { 
    BotaoIcone, 
    ContainerContagem, 
    TextoContagem 
} from "./styles";
import { IBotaoOpcaoTopoEvento } from "./interfaceOpcaoTopoEvento";

function BotaoOpcaoTopoEvento({
    icone,
    size,
    textoContagem,
    onClick
}: IBotaoOpcaoTopoEvento) {

    return (
        <BotaoIcone
            onPress={onClick}
        >
            {(textoContagem) && <ContainerContagem>
                <TextoContagem>
                    {textoContagem}
                </TextoContagem>
            </ContainerContagem>}
            <FontAwesome
                name={icone}
                size={size} 
                color="white" 
            />
        </BotaoIcone>
    )

}

export default memo(BotaoOpcaoTopoEvento);