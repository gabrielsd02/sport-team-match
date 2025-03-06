import { View } from 'react-native';

import { ITopbar } from './interfaceTopbar';
import { ContainerTopbar, TextoTopbar } from './styles';

export default function Topbar({
    texto,
    mostrarIconeVoltar=true, 
    iconeDireita
}: ITopbar) {

    return (
        <ContainerTopbar>
            <TextoTopbar>
                {texto}
            </TextoTopbar>
        </ContainerTopbar>
    )

}