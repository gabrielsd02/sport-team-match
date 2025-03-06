import { ListaUsuariosResponse } from "../interfaceListaUsuarios";

export interface ItemUsuarioProps {
    usuario: ListaUsuariosResponse['usuarios'][0];
    cliqueUsuario: () => void
    convidarUsuario: (id: number) => void
}