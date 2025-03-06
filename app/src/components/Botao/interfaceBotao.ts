import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface BotaoProps {
    children: ReactNode;
    onClick: () => void;
    semSombra?: boolean;
    style?: StyleProp<ViewStyle>;
    props?: any;
}