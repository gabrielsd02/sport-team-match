import { memo } from "react";
import { 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons'; 
import { useTheme } from "styled-components";
import { DateTime } from "luxon";

import {
    BotaoImagem,
    ContainerIcone,
    NomeParticipante,
    ImagemParticipante,
    TextoDadoParticipante,
    ContainerItemParticipante,
    ContainerDadosParticipante,
    ContainerIconeTextoParticipante,
    BotaoRemover
} from './styles';
import { IItemParticipanteProps } from "./interfaceItemParticipante";

function ItemParticipante({
    criador,
    participante,
    idUsuarioCriador,
    cliqueParticipante,
    deletarParticipante
}: IItemParticipanteProps) {

    const { cores } = useTheme();

    const criadorUsuarioParticipante = participante.idUsuario !== idUsuarioCriador;
    const dataNascimento = DateTime.fromISO(participante.dataNascimento);
    const diferencaDataNascimento = DateTime.now().diff(dataNascimento, ['years']).toObject().years?.toString(); 
    
    return (
        <ContainerItemParticipante>
            <BotaoImagem
                onPress={() => cliqueParticipante()}
            >
                {(participante.foto) ? <ImagemParticipante
                    source={participante.foto}
                /> : <FontAwesome5 
                    name={'user'}
                    color={'gray'}
                    size={50}
                />}
            </BotaoImagem>
            <ContainerDadosParticipante>
                <NomeParticipante>
                    {participante.nome}
                </NomeParticipante>
                <ContainerIconeTextoParticipante>
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
                    <TextoDadoParticipante>
                        {participante.sexo ? (participante.sexo.toUpperCase() === 'M' ? "Masculino" : "Feminino") : 'Não definido'}
                    </TextoDadoParticipante>
                </ContainerIconeTextoParticipante>
                <ContainerIconeTextoParticipante>
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
                    <TextoDadoParticipante>
                        {diferencaDataNascimento ? parseInt(diferencaDataNascimento) + ' anos': ''}
                    </TextoDadoParticipante>
                </ContainerIconeTextoParticipante>
                {(participante.idUsuario === idUsuarioCriador) && <ContainerIconeTextoParticipante
                    style={{ 
                        justifyContent: 'flex-end', 
                        marginTop: 5 
                    }}
                >
                    <TextoDadoParticipante
                        style={{
                            fontSize: 14
                        }}
                    >
                        Criador do evento
                    </TextoDadoParticipante>
                </ContainerIconeTextoParticipante>}
            </ContainerDadosParticipante>
            {(criador && criadorUsuarioParticipante) && <BotaoRemover
                onPress={() => deletarParticipante(participante.id)}
            >
                <FontAwesome 
                    name="close"
                    color={'white'}
                    size={35}
                />
            </BotaoRemover>}
        </ContainerItemParticipante>
    )

}

export default memo(ItemParticipante);