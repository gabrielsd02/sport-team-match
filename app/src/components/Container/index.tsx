import { KeyboardAvoidingView, Platform } from "react-native";

import { ContainerProps } from "./interfaceContainer";
import { ContainerComponente } from "./styles";

export default function Container({ 
    children,
    style={}
}: ContainerProps) {

    return (
        <ContainerComponente style={style || {}}>
            <KeyboardAvoidingView
                style={{ flex: 1, height: '100%', position: 'relative' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                {children}
            </KeyboardAvoidingView>
        </ContainerComponente>
    )

}