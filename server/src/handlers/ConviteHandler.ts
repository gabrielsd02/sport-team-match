import { isVazio } from "../functions";
import { IConvite } from "../interfaces/Convite";

export async function handleErrosConviteCadastro(dados: IConvite) {
    if(isVazio(dados.idEvento?.toString())) return "Evento não encontrado";
    if(isVazio(dados.idUsuarioEmissor?.toString())) return "Usuario emissor não encontrado";
    if(isVazio(dados.idUsuarioDestinatario?.toString())) return "Destinatário não encontrado";
}