import { isBefore } from "date-fns";

import { isVazio } from "../functions";
import { IEvento } from "../interfaces/Evento";

export async function handleErrosEventoSalvar(dados: IEvento, id?: string) {
    if(isVazio(dados.nome)) return "Nome do evento é obrigatório";
    if(isVazio(dados?.idCategoria?.toString())) return "Categoria é obrigatória";
    if(isVazio(dados.descricao)) return "Descrição é obrigatório";
    if(!dados?.dataHoraInicio)  return "Data/Hora são obrigatórios";
    if(isVazio(dados.duracao)) return "Duração é obrigatório";
    if(isVazio(dados.local)) return "Local da partida é obrigatório";
    if(isVazio(dados?.limiteParticipantes?.toString())) return "Limite de participantes é obrigatório";
    if(dados?.limiteParticipantes < 2) return "Limite de participantes deve ser no mínimo 2";
    if(isNaN(dados.limiteParticipantes)) return "Limite de participantes deve ser um valor numérico";
    if(!id && isBefore(
        new Date(dados.dataHoraInicio), 
        new Date(new Date().getTime() + (-3 * 60 * 60 * 1000))
    )) return "O início do evento tem de ser após a hora atual.";
}