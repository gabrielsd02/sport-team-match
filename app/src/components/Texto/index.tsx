import { TextoProps } from "./interfaceTexto";
import { TextoComponente } from "./styles";

export function Texto({
    sombra = true,
    style={},
    numberOfLines,
    children,
}: TextoProps) {

    let estilo= style;

    if(sombra) {
        estilo = Object.assign(
            style ?? {},
            {
                textShadowColor: 'rgba(0, 0, 0, 0.25)',
                textShadowOffset: {
                    width: 0, 
                    height: 3
                },
                fontFamily: 'Inter-Medium',
                textShadowRadius: 3
            }
        )
    }
    
    return (
        <TextoComponente 
            style={estilo}
            numberOfLines={numberOfLines}
        >
            {children}
        </TextoComponente>
    )

}

export default Texto;