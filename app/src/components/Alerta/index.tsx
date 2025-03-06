import { memo } from "react";
import { Modal } from "react-native";
import { useTheme } from "styled-components";

import {
    BotaoAlerta,
    TituloAlerta,
    TextoMensagem,
    ContainerTitulo,
    ContainerBotoes,
    ContainerAlerta,
    ContainerMensagem,
    FundoPressionavel
} from './styles'
import { IAlerta } from './interfaceAlerta';
import Texto from "../Texto";

function Alerta({
    fechar,
    titulo,
    textoCancelar="Cancelar",
    tamanhoTitulo="normal",
    tamanhoMensagem="quasePequeno",
    textoConfirmar="Sim",
    mensagem,
    botaoConfirmar
}: IAlerta) {
    
    const { cores, textoTamanho } = useTheme();

    return (
        <Modal
            animationType="fade"
            visible
            onRequestClose={fechar}
            transparent
            style={{ position: 'relative' }}
        >
            <FundoPressionavel
                onPress={fechar}
            >
                <ContainerAlerta
                    style={{
                        shadowColor: 'white',
                        shadowOpacity: 0.25,
                        elevation: 6
                    }}
                    onPress={(e) => e.preventDefault()}
                >
                    <ContainerTitulo>
                        <TituloAlerta
                            style={{
                                fontSize: textoTamanho[tamanhoTitulo]  
                            }}
                        >
                            {titulo}
                        </TituloAlerta>
                    </ContainerTitulo>
                    <ContainerMensagem
                        pointerEvents="none"
                    >
                        <TextoMensagem
                            style={{
                                fontSize: textoTamanho[tamanhoMensagem]  
                            }}
                        >
                            {mensagem}
                        </TextoMensagem>
                    </ContainerMensagem>
                    <ContainerBotoes>
                        <BotaoAlerta
                            style={{
                                backgroundColor: cores.cancelar,
                                shadowColor: 'black',
                                elevation: 4
                            }}
                            onPress={fechar}
                        >
                            <Texto
                                sombra={false}
                                style={{
                                    fontWeight: 'bold'
                                }}
                            >
                                {textoCancelar}
                            </Texto>
                        </BotaoAlerta>
                        {botaoConfirmar && <BotaoAlerta
                            style={{
                                backgroundColor: cores.confirmar,
                                shadowColor: 'black',
                                elevation: 4
                            }}
                            onPress={botaoConfirmar}
                        >
                            <Texto
                                sombra={false}
                                style={{
                                    fontWeight: 'bold'
                                }}
                            >
                                {textoConfirmar}
                            </Texto>
                        </BotaoAlerta>}
                    </ContainerBotoes>
                </ContainerAlerta>
            </FundoPressionavel>
        </Modal>
    )

}

export default memo(Alerta);