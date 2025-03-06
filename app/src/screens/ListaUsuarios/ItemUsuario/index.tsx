import { memo } from "react";
import { 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons'; 
import { useTheme } from "styled-components";
import { DateTime } from "luxon";

import {
    NomeUsuario,
    BotaoImagem,
    ImagemUsuario,
    BotaoConvidar,
    ContainerIcone,
    TextoDadoUsuario,
    ContainerItemUsuario,
    ContainerDadosUsuario,
    ContainerIconeTextoUsuario
} from './styles';
import { ItemUsuarioProps } from "./interfaceItemUsuarios";

function ItemUsuario({
    usuario,
    cliqueUsuario,
    convidarUsuario
}: ItemUsuarioProps) {

    const { cores } = useTheme();
    
    const distancia = (usuario.distancia < 1000) ? `${usuario.distancia}m` : `${(usuario.distancia/1000).toFixed(0)}Km`;
    const dataNascimento = DateTime.fromISO(usuario.dataNascimento);
    const diferencaDataNascimento = DateTime.now().diff(dataNascimento, ['years']).toObject().years?.toString(); 
    
    return (
        <ContainerItemUsuario>
            <BotaoImagem
                onPress={() => cliqueUsuario()}
            >
                {(usuario.foto) ? <ImagemUsuario
                    source={usuario.foto}
                /> : <FontAwesome5 
                    name={'user'}
                    color={'gray'}
                    size={50}
                />}
            </BotaoImagem>
            <ContainerDadosUsuario>
                <NomeUsuario>
                    {usuario.nome}
                </NomeUsuario>
                <ContainerIconeTextoUsuario>
                    <ContainerIcone
                        style={{
                            marginTop: 2
                        }}
                    >
                        <FontAwesome5
                            name="transgender" 
                            size={16} 
                            color={cores.texto}                                 
                        /> 
                    </ContainerIcone>
                    <TextoDadoUsuario
                        numberOfLines={1}
                    >
                        {usuario.sexo ? (usuario.sexo.toUpperCase() === 'M' ? "Masculino" : "Feminino") : 'Não definido'}
                    </TextoDadoUsuario>
                </ContainerIconeTextoUsuario>
                <ContainerIconeTextoUsuario>
                    <ContainerIcone
                        style={{
                            marginTop: 0.5
                        }}
                    >
                        <FontAwesome
                            name="user" 
                            size={16} 
                            color={cores.texto} 
                        />    
                    </ContainerIcone>
                    <TextoDadoUsuario
                        numberOfLines={1}
                    >
                        {diferencaDataNascimento ? parseInt(diferencaDataNascimento) + ' anos': ''}
                    </TextoDadoUsuario>
                </ContainerIconeTextoUsuario>
                <ContainerIconeTextoUsuario>
                    <ContainerIcone
                        style={{
                            marginTop: 0.5
                        }}
                    >
                        <FontAwesome5
                            name="map-marker-alt"
                            size={16} 
                            color={cores.texto} 
                        />    
                    </ContainerIcone>
                    <TextoDadoUsuario
                        numberOfLines={2}
                    >
                        {`À ${distancia} do evento`}
                    </TextoDadoUsuario>
                </ContainerIconeTextoUsuario>
            </ContainerDadosUsuario>
            <BotaoConvidar
                onPress={() => convidarUsuario(usuario.id)}
            >
                <FontAwesome 
                    name="check"
                    color={'white'}
                    size={35}
                />
            </BotaoConvidar>
        </ContainerItemUsuario>
    )

}

export default memo(ItemUsuario);