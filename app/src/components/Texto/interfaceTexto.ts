import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export interface TextoProps {
    children: ReactNode;
    sombra?: boolean;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
}