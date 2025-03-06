import { memo } from "react"
import { View } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'; 

import { 
    BotaoImagem, 
    BotaoOpcaoAceitar, 
    BotaoOpcaoNegar, 
    ContainerBotoes, 
    ContainerDescricao, 
    ContainerItemConvite, 
    ContainerTextoEmissao, 
    ImagemUsuarioEmissor, 
    TextoBotao, 
    TextoDataCadastro, 
    TextoDescricao 
} from "./styles";
import { format } from "../../../functions";
import { ItemConviteProps } from "./interfaceItemConvite";

function ItemConvite({ 
    convite,
    navigation,
    cliqueUsuario,
    onClickNegar,
    onClickAceitar
}: ItemConviteProps) {

    const dataHoraCadastro = format(new Date(convite.dataCadastro)).split(' ');
    const dataCadastro = dataHoraCadastro[0] + ' às ';
    const horaCadastro = dataHoraCadastro[1] + 'h';
    const conviteDoCriador = convite.tipo === 'criador_participante';
    
    return (
        <View
            style={{
                width: '100%',
                marginBottom: 15
            }}
        >
            <ContainerItemConvite
                activeOpacity={!conviteDoCriador ? 1 : 0.5}
                onPress={() => {
                    if(conviteDoCriador) {
                        navigation.navigate('Evento', {
                            id: convite.idEvento,
                            aceitarConvite: () => onClickAceitar(convite.id, convite.tipo)
                        });
                    };
                }}
            >
                <BotaoImagem
                    onPress={cliqueUsuario}
                >
                    {(convite.usuarioEmissor.foto) ? <ImagemUsuarioEmissor
                        source={convite.usuarioEmissor.foto}
                    /> : <FontAwesome5 
                        name={'user'}
                        color={'gray'}
                        size={35}
                    />}
                </BotaoImagem>
                <ContainerTextoEmissao>
                    <ContainerDescricao>
                        <TextoDescricao>
                            {convite.descricao}
                        </TextoDescricao>
                    </ContainerDescricao>
                    <TextoDataCadastro numberOfLines={1}>
                        {dataCadastro+horaCadastro}
                    </TextoDataCadastro>
                </ContainerTextoEmissao>
            </ContainerItemConvite>
            <ContainerBotoes>
                <BotaoOpcaoNegar
                    onPress={() => onClickNegar(convite.id)}
                >
                    <TextoBotao>
                        Negar
                    </TextoBotao>
                </BotaoOpcaoNegar>
                <BotaoOpcaoAceitar
                    onPress={() => onClickAceitar(convite.id, convite.tipo)}
                >
                    <TextoBotao>
                        Aceitar
                    </TextoBotao>
                </BotaoOpcaoAceitar>
            </ContainerBotoes>
        </View>
    )

};

export default memo(ItemConvite);