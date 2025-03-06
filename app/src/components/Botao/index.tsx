import { memo } from "react";

import { BotaoPadrao } from "./styles";
import { BotaoProps } from './interfaceBotao';

export function Botao({
    children,
    style={},
    semSombra,
    props,
    onClick
}: BotaoProps) {

    const estilo = Object.assign(
        style ?? {},
        {
            elevation: semSombra ? 0 : 4
        }
    )
    
    return (
        <BotaoPadrao 
            style={estilo}
            onPress={onClick}
            {...props}
        >
            {children}
        </BotaoPadrao>
    );

}

export default memo(Botao);