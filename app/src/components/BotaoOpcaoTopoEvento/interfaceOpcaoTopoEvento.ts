import { FontAwesome } from '@expo/vector-icons'; 

export interface IBotaoOpcaoTopoEvento {
    icone: keyof typeof FontAwesome.glyphMap;
    size: number;
    onClick: () => void;
    textoContagem?: string;
}