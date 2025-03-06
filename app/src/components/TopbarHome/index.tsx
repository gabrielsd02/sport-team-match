import { memo } from 'react';
import { FontAwesome5 } from '@expo/vector-icons'; 

import {
    Titulo,
    ImagemFoto,
    BotaoIconeFoto,
    ContainerTitulo
} from './styles';
import {
    IIconeTopoHome,
    ITituloTopoHome
} from './interfaceTopbarHome';

export const TituloTopoHome = memo(({
    texto
}: ITituloTopoHome) => (
    <ContainerTitulo>
        <Titulo 
            numberOfLines={1}
            style={{
                fontFamily: 'Inter-Medium'
            }}
        >
            {texto}
        </Titulo>
    </ContainerTitulo>
))

export const IconeTopoHome = memo(({
    fotoUsuario,
    navigation
}: IIconeTopoHome) =>  (
    <BotaoIconeFoto
        onPress={() => navigation.navigate('Perfil')}
    >
        {fotoUsuario ? 
            <ImagemFoto 
                source={fotoUsuario}
            /> :
            <FontAwesome5 
                name={'user'}
                color={'gray'}
                size={20}                       
            />
        }
    </BotaoIconeFoto>
))