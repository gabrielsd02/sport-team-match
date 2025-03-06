import { FontAwesome } from '@expo/vector-icons';

export interface ITopbar {
    texto: string;
    mostrarIconeVoltar?: boolean;
    iconeDireita?: keyof typeof FontAwesome.glyphMap;  
}